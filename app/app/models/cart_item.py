from marshmallow import Schema, fields

class CartItemSchema(Schema):
    """Schéma pour un élément du panier."""
    productId = fields.Str(required=True)
    quantity = fields.Int(required=True, validate=lambda x: x > 0)
    price = fields.Float(required=True, validate=lambda x: x >= 0)
    color = fields.Str(required=True)
