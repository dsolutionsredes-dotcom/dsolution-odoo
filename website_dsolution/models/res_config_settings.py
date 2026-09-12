from odoo import fields, models


class ResConfigSettings(models.TransientModel):
    _inherit = "res.config.settings"

    dsolution_hero_video = fields.Binary(
        related="website_id.dsolution_hero_video",
        readonly=False,
    )
    dsolution_hero_video_filename = fields.Char(
        related="website_id.dsolution_hero_video_filename",
        readonly=False,
    )
    dsolution_hero_image = fields.Image(
        related="website_id.dsolution_hero_image",
        readonly=False,
    )
