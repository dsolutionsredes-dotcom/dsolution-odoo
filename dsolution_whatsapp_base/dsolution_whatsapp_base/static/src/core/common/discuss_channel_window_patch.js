/** @odoo-module **/

import { DiscussChannel } from "@mail/discuss/core/common/discuss_channel_model";
import { fields } from "@mail/model/misc";
import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";

patch(DiscussChannel.prototype, {
    setup() {
        super.setup(...arguments);

        this.dsolutionWhatsappWindow = fields.Attr(
            {
                loaded: false,
                is_whatsapp: false,
                is_open: true,
                remaining_seconds: 0,
                expires_at: false,
            },
            { asProxy: true }
        );
    },

    get dsolutionWhatsappWindowClosed() {
        return Boolean(
            this.channel_type === "gateway" &&
            this.dsolutionWhatsappWindow?.loaded &&
            this.dsolutionWhatsappWindow?.is_whatsapp &&
            !this.dsolutionWhatsappWindow?.is_open
        );
    },

    get composerHidden() {
        if (this.dsolutionWhatsappWindowClosed) {
            return true;
        }
        return super.composerHidden;
    },

    get composerHiddenText() {
        if (this.dsolutionWhatsappWindowClosed) {
            return _t("Ventana de WhatsApp cerrada · usa una plantilla aprobada.");
        }
        return super.composerHiddenText;
    },
});
