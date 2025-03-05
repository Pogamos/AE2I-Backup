from marshmallow import Schema, fields, validate
from bson import ObjectId
from datetime import datetime
from app.extensions import mongo
from .base import BaseModel

class EventSchema(Schema):
    title = fields.Str(required=True, validate=validate.Length(min=1))
    description = fields.Str()
    date = fields.DateTime(required=True)
    img = fields.Str(required=True)

class Event(BaseModel):
    """Modèle pour les événements dans MongoDB."""
    collection = mongo.db.events

    def __init__(self, title, description=None, date=None, img=None, **kwargs):
        self.title = title
        self.description = description
        self.date = date or datetime.utcnow()
        self.img = img

    def save(self):
        """Enregistre un événement dans MongoDB."""
        event_data = self.__dict__.copy()
        result = self.collection.insert_one(event_data)
        self._id = result.inserted_id

    def update(self, data):
        """Met à jour un événement dans MongoDB."""
        result = self.collection.update_one(
            {"_id": self._id},
            {"$set": data}
        )
        return result.modified_count > 0

    def delete(self):
        """Supprime un événement de MongoDB."""
        result = self.collection.delete_one({"_id": self._id})
        return result.deleted_count > 0

    @classmethod
    def find_by_id(cls, event_id):
        """Recherche un événement par son ID."""
        event_data = cls.collection.find_one({"_id": ObjectId(event_id)})
        if event_data:
            event = cls(**event_data)
            event._id = event_data['_id']
            return event
        return None

    @classmethod
    def get_all(cls):
        """Récupère tous les événements."""
        events = cls.collection.find()
        return [cls.to_json(event) for event in events]

    @classmethod
    def soft_delete(cls, event_id):
        """Marque un événement comme supprimé sans le retirer définitivement."""
        result = cls.collection.update_one(
            {"_id": ObjectId(event_id)},
            {"$set": {"deleted_at": datetime.now()}}
        )
        return result.modified_count > 0

    @classmethod
    def restore(cls, event_id):
        """Restaure un événement précédemment marqué comme supprimé."""
        result = cls.collection.update_one(
            {"_id": ObjectId(event_id)},
            {"$unset": {"deleted_at": ""}}
        )
        return result.modified_count > 0