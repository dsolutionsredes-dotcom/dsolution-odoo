{
    "name": "D-Solution WhatsApp Base",
    "summary": "WhatsApp 24h customer window, templates and manual template variables",
    "version": "20.1.1.0.0",
    "license": "AGPL-3",
    "author": "D-Solution",
    "category": "Discuss",
    "depends": ["mail_gateway_whatsapp", "web"],
    "data": [
        "security/ir.model.access.csv",
        "views/mail_whatsapp_template_views.xml",
        "views/dsolution_whatsapp_template_send_views.xml"
    ],
    "assets": {
        "web.assets_backend": [
            "dsolution_whatsapp_base/static/src/core/common/composer_patch.js",
            "dsolution_whatsapp_base/static/src/core/common/composer_patch.xml",
            "dsolution_whatsapp_base/static/src/core/common/composer_patch.scss"
        ]
    },
    "installable": True,
    "application": False,
    "auto_install": False,
}
