from marshmallow import Schema, fields, validate, validates, ValidationError
from bson import ObjectId
from datetime import datetime
from app.extensions import mongo
from .base import BaseModel
from .events import EventSchema

class PostSchema(Schema):
    """Schéma de validation pour les Post."""    
    _id = fields.Str(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=1))
    description = fields.Str()
    link = fields.Str()
    event8ID = fields.Str(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    deleted_at = fields.DateTime(allow_none=True)
    
class Post(BaseModel):
    """Modèle pour les posts dans MongoDB."""
    collection = mongo.db.posts

    def __init__(self, title, description=None, link=None, event=None, **kwargs):
        self.title = title
        self.description = description
        self.link = link
        self.event = event
        self.created_at = kwargs.get("created_at")
        self.deleted_at = kwargs.get("deleted_at")

    def save(self):
        """Enregistre un post dans MongoDB."""
        post_data = self.__dict__.copy()
        result = self.collection.insert_one(post_data)
        self._id = result.inserted_id

    def update(self, data):
        """Met à jour un post dans MongoDB."""
        # if 'event' in data and self.event:
        #     for key, value in data['event'].items():
        #         self.event[key] = value
        #     data['event'] = self.event

        result = self.collection.update_one(
            {"_id": self._id},
            {"$set": data}
        )
        return result.modified_count > 0

    def delete(self):
        """Supprime un post de MongoDB."""
        result = self.collection.delete_one({"_id": self._id})
        return result.deleted_count > 0

    @classmethod
    def find_by_id(cls, post_id):
        """Recherche un post par son ID."""
        post_data = cls.collection.find_one({"_id": ObjectId(post_id)})
        if post_data:
            post = cls(**post_data)
            post._id = post_data['_id']
            return post
        return None

    @classmethod
    def get_all(cls):
        """Récupère tous les posts."""
        posts = cls.collection.find()
        return [cls.to_json(post) for post in posts]

    @classmethod
    def soft_delete(cls, post_id):
        """Marque un post comme supprimé sans le retirer définitivement."""
        result = cls.collection.update_one(
            {"_id": ObjectId(post_id)},
            {"$set": {"deleted_at": datetime.now()}}
        )
        return result.modified_count > 0

    @classmethod
    def restore(cls, post_id):
        """Restaure un post précédemment marqué comme supprimé."""
        result = cls.collection.update_one(
            {"_id": ObjectId(post_id)},
            {"$unset": {"deleted_at": ""}}
        )
        return result.modified_count > 0