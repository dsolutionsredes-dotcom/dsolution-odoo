from odoo import Command, api, fields, models, _
from odoo.exceptions import UserError

class DsolutionWhatsappTemplateSend(models.TransientModel):
    _name = "dsolution.whatsapp.template.send"
    _description = "Enviar plantilla WhatsApp desde conversación"

    channel_id = fields.Many2one("discuss.channel", string="Conversación", required=True, readonly=True)
    gateway_id = fields.Many2one("mail.gateway", related="channel_id.gateway_id", string="Gateway", readonly=True)
    template_id = fields.Many2one("mail.whatsapp.template", string="Plantilla", required=True,
        domain="[('gateway_id', '=', gateway_id), ('state', '=', 'approved'), ('is_supported', '=', True)]")
    line_ids = fields.One2many("dsolution.whatsapp.template.send.line", "wizard_id", string="Variables manuales")
    preview = fields.Text(string="Vista previa", compute="_compute_preview")

    @api.onchange("template_id")
    def _onchange_template_id(self):
        for wizard in self:
            wizard.line_ids = [Command.clear()]
            if wizard.template_id:
                wizard.line_ids = [Command.create({"variable_id": v.id, "value": ""}) for v in wizard.template_id.variable_ids.filtered(lambda v: v.value_mode == "manual")]

    def _customer_record(self):
        self.ensure_one()
        partner = self.channel_id._dsolution_customer_partner()
        if self.template_id.model == "res.partner" and partner:
            return partner
        return False

    def _manual_values(self, validate=True):
        self.ensure_one()
        if validate:
            missing = self.line_ids.filtered(lambda line: not (line.value or "").strip())
            if missing:
                raise UserError(_("Completa las variables manuales antes de enviar: %(variables)s", variables=", ".join(missing.mapped("variable_id.display_name"))))
        return {str(line.variable_id.id): line.value or "" for line in self.line_ids}

    def _template_context(self, validate=True):
        self.ensure_one()
        context = {
            "whatsapp_template_id": self.template_id.id,
            "dsolution_whatsapp_manual_variables": self._manual_values(validate=validate),
        }
        customer = self._customer_record()
        if customer:
            context.update({"default_res_id": customer.id, "res_id": customer.id})
        return context

    @api.depends("template_id", "line_ids.value")
    def _compute_preview(self):
        for wizard in self:
            if not wizard.template_id:
                wizard.preview = False
                continue
            try:
                wizard.preview = wizard.template_id.with_context(**wizard._template_context(validate=False)).render_body_message()
            except Exception:
                wizard.preview = wizard.template_id.body or ""

    def action_send(self):
        self.ensure_one()
        context = self._template_context(validate=True)
        template = self.template_id.with_context(**context)
        self.channel_id.with_context(**context).message_post(
            body=template.render_body_message(), subtype_xmlid="mail.mt_comment", message_type="comment"
        )
        return {"type": "ir.actions.act_window_close"}

class DsolutionWhatsappTemplateSendLine(models.TransientModel):
    _name = "dsolution.whatsapp.template.send.line"
    _description = "Valor de variable manual WhatsApp"

    wizard_id = fields.Many2one("dsolution.whatsapp.template.send", required=True, ondelete="cascade")
    variable_id = fields.Many2one("mail.whatsapp.template.variable", string="Variable", required=True, readonly=True)
    value = fields.Char(string="Valor", required=True)
