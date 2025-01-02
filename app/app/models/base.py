from bson.objectid import ObjectId

class BaseModel:
    @staticmethod
    def to_json(data):
        """Convertit les ObjectId en chaînes pour JSON."""
        if data and "_id" in data:
            data["_id"] = str(data["_id"])
        return data

    @staticmethod
    def from_json(data):
        """Convertit les chaînes en ObjectId pour MongoDB."""
        if data and "_id" in data:
            data["_id"] = ObjectId(data["_id"])
        return data
    
    def obj_to_json(self):
        """Transforme l'objet en JSON."""
        data = self.__dict__.copy()
        data['_id'] = str(data['_id'])
        return data

