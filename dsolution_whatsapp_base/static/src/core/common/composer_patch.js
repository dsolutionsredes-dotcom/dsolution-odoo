/** @odoo-module **/
import { Composer } from "@mail/core/common/composer";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import { onMounted, onWillDestroy, proxy, useEffect } from "@odoo/owl";

patch(Composer.prototype, {
    setup() {
        super.setup(...arguments);
        this.dsolutionWhatsappOrm = useService("orm");
        this.dsolutionWhatsappAction = useService("action");
        this.dsolutionWhatsappState = proxy({loaded: false, is_whatsapp: false, is_open: true, remaining_seconds: 0});
        useEffect(() => { this._dsolutionWhatsappRefreshWindow(); }, () => [this.thread?.id, this.thread?.channel?.channel_type]);
        onMounted(() => { this._dsolutionWhatsappTimer = setInterval(() => this._dsolutionWhatsappRefreshWindow(), 60000); });
        onWillDestroy(() => { if (this._dsolutionWhatsappTimer) clearInterval(this._dsolutionWhatsappTimer); });
    },
    get dsolutionIsWhatsappChat() {
        return Boolean(this.thread?.model === "discuss.channel" && this.thread?.channel?.channel_type === "gateway" && this.dsolutionWhatsappState.is_whatsapp);
    },
    get dsolutionWhatsappWindowLabel() {
        if (!this.dsolutionWhatsappState.loaded) return "Comprobando ventana de WhatsApp…";
        if (!this.dsolutionWhatsappState.is_open) return "Ventana cerrada · solo plantilla aprobada";
        const seconds = Math.max(0, this.dsolutionWhatsappState.remaining_seconds || 0);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.ceil((seconds % 3600) / 60);
        return hours > 0 ? `Ventana activa · quedan ${hours} h ${minutes} min` : `Ventana activa · quedan ${minutes} min`;
    },
    get isSendButtonDisabled() {
        return super.isSendButtonDisabled || (this.dsolutionIsWhatsappChat && this.dsolutionWhatsappState.loaded && !this.dsolutionWhatsappState.is_open);
    },
    async _dsolutionWhatsappRefreshWindow() {
        const thread = this.thread;
        if (!thread?.id || thread.model !== "discuss.channel" || thread.channel?.channel_type !== "gateway") {
            this.dsolutionWhatsappState.loaded = false;
            this.dsolutionWhatsappState.is_whatsapp = false;
            return;
        }
        try {
            const info = await this.dsolutionWhatsappOrm.call("discuss.channel", "dsolution_whatsapp_window_info", [[thread.id]]);
            Object.assign(this.dsolutionWhatsappState, info, {loaded: true});
        } catch {
            this.dsolutionWhatsappState.loaded = false;
        }
    },
    async dsolutionOpenWhatsappTemplateWizard() {
        if (!this.thread?.id) return;
        const action = await this.dsolutionWhatsappOrm.call("discuss.channel", "action_dsolution_send_whatsapp_template", [[this.thread.id]]);
        await this.dsolutionWhatsappAction.doAction(action);
        await this._dsolutionWhatsappRefreshWindow();
    },
});
