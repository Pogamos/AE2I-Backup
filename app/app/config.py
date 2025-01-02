import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "ATARAXIE")                # A changer
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "KAKISTOCRATIE")   # A changer
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/ae2iDB")
