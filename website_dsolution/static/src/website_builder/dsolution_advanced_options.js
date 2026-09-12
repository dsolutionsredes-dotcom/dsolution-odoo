/** @odoo-module **/

import { BaseOptionComponent } from "@html_builder/core/utils";
import { Plugin } from "@html_editor/plugin";
import { registry } from "@web/core/registry";

export class DsolutionMarketingHeroTitleOption extends BaseOptionComponent {
    static template = "website_dsolution.DsolutionMarketingHeroTitleOption";
    static selector = ".ds-md-hero";
    static applyTo = ".ds-md-hero-copy h1";
}
export class DsolutionMarketingHeroLeadOption extends BaseOptionComponent {
    static template = "website_dsolution.DsolutionMarketingHeroLeadOption";
    static selector = ".ds-md-hero";
    static applyTo = ".ds-md-lead";
}
export class DsolutionMarketingHeroButtonOption extends BaseOptionComponent {
    static template = "website_dsolution.DsolutionMarketingHeroButtonOption";
    static selector = ".ds-md-hero";
    static applyTo = ".ds-md-hero-cta";
}
export class DsolutionMarketingIncludesTitleOption extends BaseOptionComponent {
    static template = "website_dsolution.DsolutionSectionTitleOption";
    static selector = ".ds-md-includes";
    static applyTo = ".ds-md-section-heading h2";
}
export class DsolutionMarketingAudienceTitleOption extends BaseOptionComponent {
    static template = "website_dsolution.DsolutionSectionTitleOption";
    static selector = ".ds-md-audience";
    static applyTo = ".ds-md-section-heading h2";
}
export class DsolutionContactTitleOption extends BaseOptionComponent {
    static template = "website_dsolution.DsolutionSectionTitleOption";
    static selector = ".ds-contact-wrap";
    static applyTo = ".ds-contact .ds-title";
}
export class DsolutionMarketingHeroImageOption extends BaseOptionComponent {
    static template = "website_dsolution.DsolutionImageAdvancedOption";
    static selector = ".ds-md-hero";
    static applyTo = ".ds-md-hero-image";
}

export class DsolutionAdvancedOptionsPlugin extends Plugin {
    static id = "dsolutionAdvancedOptions";
    resources = {
        builder_options: [
            DsolutionMarketingHeroTitleOption,
            DsolutionMarketingHeroLeadOption,
            DsolutionMarketingHeroButtonOption,
            DsolutionMarketingIncludesTitleOption,
            DsolutionMarketingAudienceTitleOption,
            DsolutionContactTitleOption,
            DsolutionMarketingHeroImageOption,
        ],
    };
}
registry.category("website-plugins").add(
    DsolutionAdvancedOptionsPlugin.id,
    DsolutionAdvancedOptionsPlugin
);
