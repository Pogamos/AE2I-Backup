from marshmallow import Schema, fields

class StaffSchema(Schema):
    """Schéma pour un membre du staff."""
    staffId = fields.Str(required=True)
    ppicture = fields.Str(allow_none=True)
    staffRole = fields.Str(required=True)
    description = fields.Str(required=True)
    promo = fields.Str(required=True)
