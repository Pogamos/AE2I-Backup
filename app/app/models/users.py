from marshmallow import Schema, fields, validate, validates, ValidationError
from bson import ObjectId
from app.extensions import mongo
from .base import BaseModel
from .cart_item import CartItemSchema

class UserSchema(Schema):
    """Schéma de validation pour les utilisateurs."""
    _id = fields.Str(dump_only=True)
    lastName = fields.Str(required=True, validate=validate.Length(min=1))
    firstName = fields.Str(required=True, validate=validate.Length(min=1))
    email = fields.Email(required=True, validate=validate.Email())
    ppicture = fields.Str(allow_none=True)
    role = fields.Str(default="user")
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

class User(BaseModel):
    """Modèle utilisateur pour MongoDB."""
    collection = mongo.db.users 

    def __init__(self, lastName, firstName, email, password, **kwargs):
        self.lastName = lastName
        self.firstName = firstName
        self.email = email
        self.password = password
        self.ppicture = kwargs.get("ppicture")
        self.role = kwargs.get("role", 'user')
        self.isAdherant = kwargs.get("isAdherant", False)
        self.cart = kwargs.get("cart", [])

    def save(self):
        """Enregistre un utilisateur dans MongoDB."""
        user_data = self.__dict__.copy()
        result = self.collection.insert_one(user_data)
        self._id = result.inserted_id
        
    def update(self, data):
        """Met à jour un utilisateur dans MongoDB."""
        result = self.collection.update_one(
            {"_id": self._id},
            {"$set": data}
        )
        return result.modified_count > 0
        
    def delete(self):
        """Supprime un utilisateur de MongoDB."""
        result = self.collection.delete_one({"_id": self._id})
        return result.deleted_count > 0

    # Return a JSON representation of the object
    @classmethod
    def find_by_email(cls, email):
        """Recherche un utilisateur par son email."""
        user = cls.collection.find_one({"email": email})
        print(user)
        return cls.to_json(user) if user else None
    
    # Return User object
    @classmethod
    def find_by_id(cls, user_id):
        """Recherche un utilisateur par son email."""
        user_data = cls.collection.find_one({"_id": ObjectId(user_id)})
        if user_data:
            user = cls(**user_data)
            user._id = user_data['_id']
            return user
        return None
    
    @classmethod
    def get_all(cls):
        """Récupère tous les utilisateurs."""
        users = cls.collection.find()
        return [cls.to_json(user) for user in users]

    @classmethod
    def add_to_cart(cls, user_id, item):
        """Ajoute un élément au panier d'un utilisateur."""
        result = cls.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$push": {"cart": item}}
        )
        return result.modified_count > 0

    @classmethod
    def get_cart(cls, user_id):
        """Récupère le panier d'un utilisateur."""
        user = cls.collection.find_one({"_id": ObjectId(user_id)})
        return user.get("cart", [])
    
    @classmethod
    def delete_from_cart(cls, user_id, item_id):
        """Supprime un élément du panier d'un utilisateur."""
        result = cls.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$pull": {"cart": {"productId": item_id}}}
        )
        return result.modified_count > 0
    
    @classmethod
    def flush_cart(cls, user_id):
        """Vide le panier d'un utilisateur."""
        result = cls.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"cart": []}}
        )
        return result.modified_count > 0
    
