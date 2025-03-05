from marshmallow import Schema, fields, validate
from bson import ObjectId
from app.extensions import mongo
from .base import BaseModel
from .cart_item import CartItemSchema
from datetime import datetime


class CommandsSchema(Schema):
    _id = fields.Str(dump_only=True)
    items = fields.List(fields.Str(), required=False)
    user_id = fields.Str(required=True) 
    created_at = fields.DateTime(dump_only=True)
    total_price = fields.Float(required=True)
    
    
class Commands(BaseModel):
    collection = mongo.db.commands

    def __init__(self, user_id, items=None, **kwargs):
        self.user_id = user_id
        self.items = items if items is not None else []
        self.created_at = kwargs.get("created_at", datetime.now())

    def save(self):
        """Enregistre une commande dans MongoDB."""
        command_data = self.__dict__.copy()
        result = self.collection.insert_one(command_data)
        self._id = result.inserted_id

    def update(self, data):
        """Met à jour une commande dans MongoDB."""
        result = self.collection.update_one(
            {"_id": self._id},
            {"$set": data}
        )
        return result.modified_count > 0

    def delete(self):
        """Supprime une commande de MongoDB."""
        result = self.collection.delete_one({"_id": self._id})
        return result.deleted_count > 0

    @classmethod
    def find_by_id(cls, command_id):
        """Recherche une commande par son ID."""
        command_data = cls.collection.find_one({"_id": ObjectId(command_id)})
        if command_data:
            command = cls(**command_data)
            command._id = command_data['_id']
            return command
        return None

    @classmethod
    def get_all(cls):
        """Récupère toutes les commandes."""
        commands = cls.collection.find()
        return [cls.to_json(command) for command in commands]

    @classmethod
    def find_by_user_id(cls, user_id):
        """Recherche les commandes par user_id."""
        commands_data = cls.collection.find({"user_id": user_id})
        return [cls(**command_data) for command_data in commands_data]
