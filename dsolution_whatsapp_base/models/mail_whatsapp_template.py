from odoo import api, fields, models, _
from odoo.exceptions import UserError, ValidationError

class MailWhatsAppTemplateVariable(models.Model):
    _inherit = "mail.whatsapp.template.variable"

    value_mode = fields.Selection([
        ("field", "Campo de Odoo"),
        ("manual", "Texto manual"),
    ], string="Tipo de valor", default="field", required=True)

    @api.onchange("value_mode")
    def _onchange_value_mode(self):
        for variable in self:
            if variable.value_mode == "manual":
                variable.field_name = False

    @api.constrains("field_name", "value_mode")
    def _check_field_name(self):
        failing = self.browse()
        field_variables = self.filtered(lambda variable: variable.value_mode == "field")
        missing = field_variables.filtered(lambda variable: not variable.field_name)
        if missing:
            raise ValidationError(_("Las variables automáticas %(variables)s deben estar asociadas con un campo de Odoo.", variables=", ".join(missing.mapped("name"))))
        for variable in field_variables - missing:
            model = self.env[variable.model]
            if not model.has_access("read"):
                raise ValidationError(_("No tienes permiso para leer campos de %(model)s.", model=self.env["ir.model"]._get(variable.model).display_name))
            try:
                variable._extract_value_from_field_path(model)
            except UserError:
                failing += variable
        if failing:
            raise ValidationError(_("Los campos %(field_names)s no parecen válidos para %(model_name)s.", field_names=", ".join(failing.mapped("field_name")), model_name=self.env["ir.model"]._get(failing.mapped("model")[0]).display_name))

    def _get_variables_value(self, record):
        manual_values = self.env.context.get("dsolution_whatsapp_manual_variables", {})
        value_by_name = {}
        for variable in self:
            if variable.value_mode == "manual":
                if "dsolution_whatsapp_manual_variables" not in self.env.context:
                    raise UserError(_("Esta plantilla contiene variables manuales. Envíala desde el botón 'Enviar plantilla' de la conversación de WhatsApp."))
                value = manual_values.get(str(variable.id))
                if value is None:
                    value = manual_values.get(variable.name)
                value = value or ""
            else:
                if not record:
                    raise UserError(_("La plantilla usa la variable automática %(variable)s, pero este chat todavía no tiene un contacto de Odoo del que obtener el campo. Usa una variable manual o vincula primero el cliente a un contacto.", variable=variable.display_name))
                value = variable._extract_value_from_field_path(record)
            value_by_name[f"{variable.line_type}-{variable.name}"] = str(value) if value is not False and value is not None else ""
        return value_by_name

class MailWhatsAppTemplate(models.Model):
    _inherit = "mail.whatsapp.template"

    def _dsolution_context_record(self):
        self.ensure_one()
        rec_id = self.env.context.get("default_res_id") or self.env.context.get("res_id")
        if self.model_id.model and rec_id:
            return self.env[self.model_id.model].browse(int(rec_id))
        return False

    def prepare_value_to_send(self):
        if "dsolution_whatsapp_manual_variables" not in self.env.context:
            return super().prepare_value_to_send()
        self.ensure_one()
        values = self.variable_ids._get_variables_value(self._dsolution_context_record())
        components = []
        header = self._prepare_header_component(variable_ids_value=values)
        body = self._prepare_body_components(variable_ids_value=values)
        buttons = self._prepare_button_components(variable_ids_value=values)
        if header: components.append(header)
        if body: components.append(body)
        components.extend(buttons)
        return components

    def render_body_message(self):
        if "dsolution_whatsapp_manual_variables" not in self.env.context:
            return super().render_body_message()
        self.ensure_one()
        values = self.variable_ids._get_variables_value(self._dsolution_context_record())
        header = self.header or ""
        for variable in self.variable_ids.filtered(lambda v: v.line_type == "header"):
            header = header.replace(variable.name, values.get(f"header-{variable.name}", ""))
        body = self.body or ""
        for variable in self.variable_ids.filtered(lambda v: v.line_type == "body"):
            body = body.replace(variable.name, values.get(f"body-{variable.name}", ""))
        return f"*{header}*\n\n{body}" if header else body
