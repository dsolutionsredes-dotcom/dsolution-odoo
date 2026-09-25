/** @odoo-module **/

import { DiscussContent } from "@mail/core/public_web/discuss_content";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import { onMounted, onWillDestroy, useOnChange } from "@odoo/owl";

patch(DiscussContent.prototype, {
    setup() {
        super.setup(...arguments);

        this.dsolutionWhatsappOrm = useService("orm");
        this.dsolutionWhatsappAction = useService("action");

        useOnChange(
            () => [
                this.thread?.id,
                this.thread?.channel?.channel_type,
                this.thread?.messages?.length,
            ],
            () => this._dsolutionWhatsappRefreshWindow()
        );

        onMounted(() => {
            this._dsolutionWhatsappTimer = setInterval(
                () => this._dsolutionWhatsappRefreshWindow(),
                60000
            );
        });

        onWillDestroy(() => {
            if (this._dsolutionWhatsappTimer) {
                clearInterval(this._dsolutionWhatsappTimer);
            }
        });
    },

    get dsolutionWhatsappWindow() {
        return this.thread?.channel?.dsolutionWhatsappWindow;
    },

    get dsolutionIsWhatsappChat() {
        return Boolean(
            this.thread?.model === "discuss.channel" &&
            this.thread?.channel?.channel_type === "gateway" &&
            this.dsolutionWhatsappWindow?.loaded &&
            this.dsolutionWhatsappWindow?.is_whatsapp
        );
    },

    get dsolutionWhatsappWindowClosed() {
        return Boolean(
            this.dsolutionIsWhatsappChat &&
            !this.dsolutionWhatsappWindow?.is_open
        );
    },

    get dsolutionWhatsappWindowLabel() {
        const state = this.dsolutionWhatsappWindow;

        if (!state?.loaded) {
            return "Comprobando ventana de WhatsApp…";
        }

        if (!state.is_open) {
            return "Ventana cerrada · solo plantilla aprobada";
        }

        const seconds = Math.max(0, state.remaining_seconds || 0);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.ceil((seconds % 3600) / 60);

        return hours > 0
            ? `Ventana activa · quedan ${hours} h ${minutes} min`
            : `Ventana activa · quedan ${minutes} min`;
    },

    async _dsolutionWhatsappRefreshWindow() {
        const thread = this.thread;
        const channel = thread?.channel;

        if (
            !thread?.id ||
            thread.model !== "discuss.channel" ||
            channel?.channel_type !== "gateway"
        ) {
            return;
        }

        try {
            const info = await this.dsolutionWhatsappOrm.call(
                "discuss.channel",
                "dsolution_whatsapp_window_info",
                [[thread.id]]
            );

            Object.assign(
                channel.dsolutionWhatsappWindow,
                info,
                { loaded: true }
            );
        } catch {
            channel.dsolutionWhatsappWindow.loaded = false;
        }
    },

    async dsolutionOpenWhatsappTemplateWizard() {
        const action = await this.dsolutionWhatsappOrm.call(
            "discuss.channel",
            "action_dsolution_send_whatsapp_template",
            [[this.thread.id]]
        );

        await this.dsolutionWhatsappAction.doAction(action);
        await this._dsolutionWhatsappRefreshWindow();
    },
});
