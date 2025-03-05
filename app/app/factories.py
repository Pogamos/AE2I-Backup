from faker import Faker
import random
import string
from .extensions import mongo
from werkzeug.security import generate_password_hash

fake = Faker()

def generate_secure_password():
    """ Génère un mot de passe respectant les règles de sécurité. """
    special_chars = "!@#$%^&*()-_=+[]{};:'\",.<>?/`~"
    
    password = (
        random.choice(string.ascii_uppercase) +  # Au moins une majuscule
        random.choice(string.ascii_lowercase) +  # Au moins une minuscule
        random.choice(string.digits) +  # Au moins un chiffre
        random.choice(special_chars) +  # Au moins un caractère spécial
        ''.join(random.choices(string.ascii_letters + string.digits + special_chars, k=5))  # 5 caractères aléatoires
    )
    
    return "".join(random.sample(password, len(password)))  # Mélange les caractères

def clear_db():
    """ Efface les utilisateurs de la base de données """
    users_collection = mongo.db.users

    # Vider les collections
    users_collection.delete_many({})

    print("Base de données nettoyée !")
    
def create_fake_users(n=10):
    """ Génère des utilisateurs factices et les insère dans la base de données """
    users_collection = mongo.db.users
    fake_users = []

    for _ in range(n):
        user = {
            "lastName": fake.last_name(),
            "firstName": fake.first_name(),
            "email": fake.email(),
            "role": "user",
            "isAdherant": fake.boolean(),
            "cart": [],
            "staff": [], 
            "password": generate_secure_password(), 
        }
        fake_users.append(user)

    users_collection.insert_many(fake_users)
    print(f"{n} utilisateurs factices créés !")
    
def create_fake_staff(n=5):
    """ Génère des employés factices et les insère dans la base de données """
    staff_collection = mongo.db.users
    fake_staff = []

    for _ in range(n):
        staff_member = {
            "lastName": fake.last_name(),
            "firstName": fake.first_name(),
            "email": fake.email(),
            "role": "admin",
            "isAdherant": True,
            "cart": [],
            "staff": {
                "staffRole": fake.random_element(elements=["Président.e", "Vice-Président.e", "Secrétaire", "Trésorier.e", "Community Manager"]),
                "description": fake.text(max_nb_chars=200),
                "promo": fake.random_element(elements=["MMI1", "MMI2", "MMI3", "INFO1", "INFO2", "INFO3"])
            },
            "password": generate_secure_password(),
        }
        fake_staff.append(staff_member)

    staff_collection.insert_many(fake_staff)
    print(f"{n} employés factices créés !")
    
def create_static_user():
    """ Crée un utilisateur statique avec des informations prédéfinies. """
    static_user = {
        "lastName": "Admin",
        "firstName": "Test",
        "email": "admin@ae2i.com",
        "role": "superadmin",
        "isAdherant": True,
        "cart": [],
        "staff": [],
        "password": generate_password_hash("admin")
    }
    users_collection = mongo.db.users
    users_collection.insert_one(static_user)
    print("Utilisateur statique 'admin@test.com' créé !")
