from odoo import fields, models


class Website(models.Model):
    _inherit = "website"

    dsolution_hero_video = fields.Binary(
        string="D-Solution Hero Video",
        attachment=True,
        copy=False,
        help="MP4 uploaded for the D-Solution homepage hero.",
    )
    dsolution_hero_video_filename = fields.Char(
        string="D-Solution Hero Video Filename",
        copy=False,
    )
    dsolution_hero_video_url = fields.Char(
        string="D-Solution Hero Video URL",
        copy=False,
        help=(
            "Direct public MP4 URL used by the homepage Hero. "
            "Prefer a CDN/object-storage URL instead of serving the video "
            "through Odoo /web/content."
        ),
    )
    dsolution_hero_image = fields.Image(
        string="D-Solution Hero Image",
        max_width=1920,
        max_height=1080,
        attachment=True,
        copy=False,
        help="Fallback/poster image used when the hero video is unavailable.",
    )
