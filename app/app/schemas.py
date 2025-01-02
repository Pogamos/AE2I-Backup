from marshmallow import Schema, fields, validate, validates, ValidationError

# FICHIER SCHEMA SERVANT A VALIDER LES DONNEES RECUES




##### DEPRECATED #####




# SCHEMA BOUTIQUE
# Schéma pour les articles
class ArticleSchema(Schema):
    _id = fields.Str(dump_only=True)
    titre = fields.Str(required=True, validate=validate.Length(min=1, max=255))
    description = fields.Str() 
    price = fields.Float(required=True)
    photo = fields.Str()  
    created_at = fields.DateTime(dump_only=True)
    
class CartItemSchema(Schema):
    article_id = fields.Str(required=True)
    quantity = fields.Int(required=True, validate=validate.Range(min=1))


# Schéma pour les utilisateurs
class UserSchema(Schema):
    _id = fields.Str(dump_only=True) 
    lastName = fields.Str(required=True, validate=validate.Length(min=1))
    firstName = fields.Str(required=True, validate=validate.Length(min=1))
    email = fields.Email(required=True, validate=validate.Email())
    ppicture = fields.Str(allow_none=True)
    isAdmin = fields.Boolean(default=False)
    isAdherant = fields.Boolean(default=False)
    cart = fields.List(fields.Nested(CartItemSchema), required=False)
    
    password = fields.Str(
        required=True,
        load_only=True,
        validate=validate.Length(min=8)
    )

    @validates("password")
    def validate_password(self, value):
        if not any(char.isdigit() for char in value):
            raise ValidationError("Password must contain at least one digit.")
        if not any(char.isalpha() for char in value):
            raise ValidationError("Password must contain at least one letter.")
        if not any(char in "!@#$%^&*()-_=+[]{};:'\",.<>?/`~" for char in value):
            raise ValidationError("Password must contain at least one special character.")
        
        
class StaffSchema(Schema):
    _id = fields.Str(dump_only=True) 
    role = fields.Str(required=True)
    promo = fields.Str(required=True)
    description = fields.Str(default="Bonjour tout le monde ! J'adoore l'AE2I ! J'ai très hâte de vous rencontrer !")
    phone = fields.Str(required=False)
    email = fields.Email(required=False, validate=validate.Email())
        
# SCHEMA SONDAGES
# Schéma pour les choix de sondage
class ChoiceSchema(Schema):
    _id = fields.Str(dump_only=True)
    choice_text = fields.Str(required=True, validate=validate.Length(min=1))

# Schéma pour les sondages
class PollSchema(Schema):
    _id = fields.Str(dump_only=True)
    titre = fields.Str(required=True, validate=validate.Length(min=1))
    description = fields.Str(required=True)
    choices = fields.List(fields.Nested(ChoiceSchema), required=True)

# Schéma réponse sondage
class ResponseSchema(Schema):
    _id = fields.Str(dump_only=True)
    poll_id = fields.Str(required=True)
    user_id = fields.Str(required=False)
    choice_id = fields.Str(required=True)
    created_at = fields.DateTime(dump_only=True)


# SCHEMA POST
# Schéma pour les événements
class EventSchema(Schema):
    title = fields.Str(required=True, validate=validate.Length(min=1))
    description = fields.Str()
    date = fields.DateTime(required=True)

# Schéma pour les posts
class PostSchema(Schema):
    _id = fields.Str(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=1))
    description = fields.Str()
    link = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    deleted_at = fields.DateTime(allow_none=True)
    event = fields.Nested(EventSchema, allow_none=True)

