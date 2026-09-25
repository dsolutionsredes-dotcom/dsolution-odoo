from datetime import timedelta
from odoo import fields, models, _
from odoo.exceptions import UserError

class DiscussChannel(models.Model):
    _inherit = "discuss.channel"

    def _dsolution_is_whatsapp_channel(self):
        self.ensure_one()
        return bool(self.channel_type == "gateway" and self.gateway_id and self.gateway_id.gateway_type == "whatsapp")

    def _dsolution_customer_partner(self):
        self.ensure_one()
        if not self._dsolution_is_whatsapp_channel():
            return self.env["res.partner"]
        link = self.env["res.partner.gateway.channel"].sudo().search([
            ("gateway_id", "=", self.gateway_id.id),
            ("gateway_token", "=", self.gateway_channel_token),
        ], limit=1)
        return link.partner_id

    def _dsolution_is_customer_message(self, message):
        self.ensure_one()
        if not self._dsolution_is_whatsapp_channel():
            return False
        token = str(self.gateway_channel_token or "")
        guest = message.author_guest_id
        if guest:
            return bool(guest.gateway_id == self.gateway_id and str(guest.gateway_token or "") == token)
        partner = message.author_id
        if partner:
            return bool(partner.gateway_channel_ids.filtered(
                lambda rec: rec.gateway_id == self.gateway_id and str(rec.gateway_token or "") == token
            ))
        return False

    def _dsolution_last_customer_whatsapp_message(self):
        self.ensure_one()
        if not self._dsolution_is_whatsapp_channel():
            return self.env["mail.message"]
        messages = self.env["mail.message"].sudo().search([
            ("model", "=", self._name),
            ("res_id", "=", self.id),
            ("gateway_type", "=", "whatsapp"),
            ("message_type", "=", "comment"),
        ], order="date desc, id desc", limit=500)
        for message in messages:
            if self._dsolution_is_customer_message(message):
                return message
        return self.env["mail.message"]

    def dsolution_whatsapp_window_info(self):
        self.ensure_one()
        if not self._dsolution_is_whatsapp_channel():
            return {"is_whatsapp": False, "is_open": True, "remaining_seconds": 0, "last_customer_message": False, "expires_at": False}
        last_message = self._dsolution_last_customer_whatsapp_message()
        if not last_message:
            return {"is_whatsapp": True, "is_open": False, "remaining_seconds": 0, "last_customer_message": False, "expires_at": False}
        expires_at = last_message.date + timedelta(hours=24)
        remaining = max(0, int((expires_at - fields.Datetime.now()).total_seconds()))
        return {
            "is_whatsapp": True,
            "is_open": remaining > 0,
            "remaining_seconds": remaining,
            "last_customer_message": fields.Datetime.to_string(last_message.date),
            "expires_at": fields.Datetime.to_string(expires_at),
        }

    def action_dsolution_send_whatsapp_template(self):
        self.ensure_one()
        if not self._dsolution_is_whatsapp_channel():
            raise UserError(_("Esta acción solo está disponible para chats de WhatsApp."))
        return {
            "type": "ir.actions.act_window",
            "name": _("Enviar plantilla de WhatsApp"),
            "res_model": "dsolution.whatsapp.template.send",
            "view_mode": "form",
            "views": [(False, "form")],
            "target": "new",
            "context": {"default_channel_id": self.id},
        }

    def _dsolution_is_incoming_customer_post(self, author_id=False):
        self.ensure_one()
        if not self._dsolution_is_whatsapp_channel():
            return False

        guest = self.env.context.get("guest")
        if guest and getattr(guest, "_name", False) == "mail.guest":
            if guest.gateway_id == self.gateway_id and str(guest.gateway_token or "") == str(self.gateway_channel_token or ""):
                return True

        if author_id:
            partner = self.env["res.partner"].sudo().browse(author_id)
            return bool(partner.gateway_channel_ids.filtered(
                lambda rec: rec.gateway_id == self.gateway_id
                and str(rec.gateway_token or "") == str(self.gateway_channel_token or "")
            ))
        return False

    def message_post(self, *, message_type="notification", gateway_type=False, **kwargs):
        if (
            message_type != "notification"
            and not self.env.context.get("whatsapp_template_id")
            and not self.env.context.get("no_gateway_notification")
        ):
            for channel in self:
                if not channel._dsolution_is_whatsapp_channel():
                    continue
                if channel._dsolution_is_incoming_customer_post(kwargs.get("author_id")):
                    continue
                if not channel.dsolution_whatsapp_window_info()["is_open"]:
                    raise UserError(_("La ventana de 24 horas de WhatsApp está cerrada. No se puede enviar texto libre. Usa una plantilla aprobada."))
        return super().message_post(message_type=message_type, gateway_type=gateway_type, **kwargs)
