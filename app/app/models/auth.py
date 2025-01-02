from marshmallow import Schema, fields

class LoginSchema(Schema):
    """Schéma pour valider les informations de connexion."""
    email = fields.Email(required=True)
    password = fields.String(required=True, load_only=True)

class TokenSchema(Schema):
    """Schéma pour générer des tokens JWT."""
    access_token = fields.String(required=True)
    refresh_token = fields.String(required=False)
