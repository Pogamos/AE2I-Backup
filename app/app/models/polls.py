from marshmallow import Schema, fields, validate, validates, ValidationError
from bson import ObjectId
from app.extensions import mongo
from .base import BaseModel
from datetime import datetime

class ChoiceSchema(Schema):
    _id = fields.Str(dump_only=True)
    choice_text = fields.Str(required=True, validate=validate.Length(min=1))

# Schéma pour les sondages
class PollSchema(Schema):
    _id = fields.Str(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=1))
    description = fields.Str(required=True)
    choices = fields.List(fields.Nested(ChoiceSchema), required=True)

# Schéma réponse sondage
class ResponseSchema(Schema):
    _id = fields.Str(dump_only=True)
    poll_id = fields.Str(required=True)
    user_id = fields.Str(required=False)
    choice = fields.Str(required=True)
    created_at = fields.DateTime(dump_only=True)


#### POLLS PART ###################################################################################################################################
class Poll(BaseModel):
    """Modèle pour les sondages dans MongoDB."""
    collection = mongo.db.polls

    def __init__(self, title, description, choices, **kwargs):
        self.title = title
        self.description = description
        self.choices = choices
        self.created_at = kwargs.get("created_at", datetime.now())

    def save(self):
        """Enregistre un sondage dans MongoDB."""
        poll_data = self.__dict__.copy()
        result = self.collection.insert_one(poll_data)
        self._id = result.inserted_id

    def update(self, data):
        """Met à jour le titre et la description d'un sondage dans MongoDB."""
        update_data = {key: data[key] for key in ['title', 'description', 'choices'] if key in data}
        result = self.collection.update_one(
            {"_id": self._id},
            {"$set": update_data}
        )
        return result.modified_count > 0

    def delete(self):
        """Supprime un sondage de MongoDB."""
        result = self.collection.delete_one({"_id": self._id})
        return result.deleted_count > 0

    @classmethod
    def find_by_id(cls, poll_id):
        """Recherche un sondage par son ID."""
        poll_data = cls.collection.find_one({"_id": ObjectId(poll_id)})
        if poll_data:
            poll = cls(**poll_data)
            poll._id = poll_data['_id']
            return poll
        return None

    @classmethod
    def get_all(cls):
        """Récupère tous les sondages."""
        polls = cls.collection.find()
        return [cls.to_json(poll) for poll in polls]
    
    
#### RESPONSES PART ###################################################################################################################################

class Response(BaseModel):
    """Modèle pour les réponses aux sondages dans MongoDB."""
    collection = mongo.db.responses

    def __init__(self, poll_id, choice, user_id=None, **kwargs):
        self.poll_id = poll_id
        self.choice = choice
        self.user_id = user_id
        self.created_at = kwargs.get("created_at", datetime.now())

    def save(self):
        """Enregistre une réponse dans MongoDB."""
        response_data = self.__dict__.copy()
        result = self.collection.insert_one(response_data)
        self._id = result.inserted_id

    @classmethod
    def find_by_poll_id(cls, poll_id):
        """Recherche toutes les réponses associées à un sondage."""
        responses = cls.collection.find({"poll_id": poll_id})
        return [cls.to_json(response) for response in responses]

    @classmethod
    def find_by_user_id(cls, user_id):
        """Recherche toutes les réponses associées à un utilisateur."""
        responses = cls.collection.find({"user_id": user_id})
        return [cls.to_json(response) for response in responses]