from marshmallow import Schema, fields, validate, validates, ValidationError
from bson import ObjectId
from app.extensions import mongo
from .base import BaseModel
from datetime import datetime


class ArticleSchema(Schema):
    _id = fields.Str(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=1, max=255))
    description = fields.Str() 
    price = fields.Float(required=True)
    photo = fields.Str()  
    created_at = fields.DateTime(dump_only=True)
    
    
class Article(BaseModel):
    collection = mongo.db.articles

    def __init__(self, title, price, description=None, photo=None, **kwargs):
        self.title = title
        self.description = description
        self.price = price
        self.photo = photo
        self.created_at = kwargs.get("created_at", datetime.utcnow())

    def save(self):
        """Enregistre un article dans MongoDB."""
        article_data = self.__dict__.copy()
        result = self.collection.insert_one(article_data)
        self._id = result.inserted_id

    def update(self, data):
        """Met à jour un article dans MongoDB."""
        result = self.collection.update_one(
            {"_id": self._id},
            {"$set": data}
        )
        return result.modified_count > 0

    def delete(self):
        """Supprime un article de MongoDB."""
        result = self.collection.delete_one({"_id": self._id})
        return result.deleted_count > 0

    @classmethod
    def find_by_id(cls, article_id):
        """Recherche un article par son ID."""
        article_data = cls.collection.find_one({"_id": ObjectId(article_id)})
        if article_data:
            article = cls(**article_data)
            article._id = article_data['_id']
            return article
        return None

    @classmethod
    def get_all(cls):
        """Récupère tous les articles."""
        articles = cls.collection.find()
        return [cls.to_json(article) for article in articles]