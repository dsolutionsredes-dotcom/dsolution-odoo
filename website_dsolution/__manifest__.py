{
    "name": "D-Solution Website",
    "summary": "Premium D-Solution website theme and CRM-ready lead capture",
    "description": """
D-Solution website theme for Odoo Community master/19.5 alpha.
Rebuilds the current D-Solution visual identity inside Odoo Website and
connects the contact form directly to CRM opportunities.
""",
    "category": "Website/Theme",
    "version": "19.5.1.0.8",
    "author": "D-Solution",
    "website": "https://d-solution.org",
    "license": "LGPL-3",
    "depends": ["website", "website_crm"],
    "data": [
        "views/templates.xml",
        "views/snippets.xml",
        "data/homepage.xml",
        "data/pages.xml",
    ],
    "assets": {
        "web.assets_frontend": [
            "website_dsolution/static/src/css/theme.css",
            "website_dsolution/static/src/js/theme.js",
        ],
    },
    "installable": True,
    "application": False,
}
