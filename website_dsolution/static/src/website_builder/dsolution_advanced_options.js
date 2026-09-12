/** @odoo-module **/

import { BaseOptionComponent } from "@html_builder/core/utils";
import { Plugin } from "@html_editor/plugin";
import { registry } from "@web/core/registry";

export class DsolutionTextAdvancedOption extends BaseOptionComponent {
    static template = "website_dsolution.DsolutionTextAdvancedOption";
    static selector = [
        ".dsolution-page h1",
        ".dsolution-page h2",
        ".dsolution-page h3",
        ".dsolution-page h4",
        ".dsolution-page p",
        ".dsolution-page .ds-eyebrow",
        ".dsolution-page .ds-service-link",
        ".dsolution-page .ds-brand-tagline",
    ].join(", ");
}

export class DsolutionBoxAdvancedOption extends BaseOptionComponent {
    static template = "website_dsolution.DsolutionBoxAdvancedOption";
    static selector = [
        ".dsolution-page .ds-btn",
        ".dsolution-page .ds-cta",
        ".dsolution-page .ds-md-hero-cta",
        ".dsolution-page .ds-service-card",
        ".dsolution-page .ds-md-include-card",
        ".dsolution-page .ds-md-audience-card",
        ".dsolution-page .ds-contact",
        ".dsolution-page .ds-md-services-panel",
    ].join(", ");
}

export class DsolutionImageAdvancedOption extends BaseOptionComponent {
    static template = "website_dsolution.DsolutionImageAdvancedOption";
    static selector = ".dsolution-page img.o_we_custom_image";
}

export class DsolutionBrandLogoOption extends BaseOptionComponent {
    static template = "website_dsolution.DsolutionBrandLogoOption";
    static selector = ".dsolution-page .ds-md-service-logo img.o_we_custom_image";
}

export class DsolutionAdvancedOptionsPlugin extends Plugin {
    static id = "dsolutionAdvancedOptions";
    resources = {
        builder_options: [
            DsolutionTextAdvancedOption,
            DsolutionBoxAdvancedOption,
            DsolutionImageAdvancedOption,
            DsolutionBrandLogoOption,
        ],
    };
}

registry.category("website-plugins").add(
    DsolutionAdvancedOptionsPlugin.id,
    DsolutionAdvancedOptionsPlugin
);
