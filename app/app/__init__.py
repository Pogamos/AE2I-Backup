from flask import Flask
from .extensions import jwt, mongo
from .config import Config
from .log_config import setup_logger
from flasgger import Swagger


####################################################################################################
#                                                                                                  #
#                                             TODO                                                 #
#                 -faire les tests                                                                 #
#                 -faire la doc                                                                    #
#                 -Ajouter le JWT aux routes en ayant besoin                                       #
#                 -Quand soft delete recuperer les données pas supprimées ?                        #
#                                                                                                  #
####################################################################################################


def create_app():
    # print("creating app :P")
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialisation des extensions
    jwt.init_app(app)
    mongo.init_app(app)
    
    # Configuration du swagger
    swagger_config = {
        "headers": [],
        "specs": [
            {
                "endpoint": 'apispec_1',
                "route": '/api/swagger.json',
                "rule_filter": lambda rule: True,
                "model_filter": lambda tag: True,
            }
        ],
        "static_url_path": "/flasgger_static",
        "swagger_ui": True,
        "specs_route": "/api/docs/",
        "ui_params": {
            "docExpansion": "none"
        }
    }
    swagger = Swagger(app, config=swagger_config, template_file="./docs/swagger.yaml")

    # Enregistrement des blueprints
    from .routes import users, auth, posts, polls, articles, events, base
    app.register_blueprint(base.bp, url_prefix='/api')
    app.register_blueprint(users.bp, url_prefix='/api/users') # TOUT MARCHE                     TODO AJouter gestion Cart
    app.register_blueprint(auth.bp, url_prefix='/api/auth') # TOUT MARCHE                       
    app.register_blueprint(posts.bp, url_prefix='/api/posts') # TOUT MARCHE                     TODO Ajouter gestion Events
    app.register_blueprint(events.bp, url_prefix='/api/events') 
    app.register_blueprint(polls.bp, url_prefix='/api/polls') # TOUT MARCHE
    app.register_blueprint(articles.bp, url_prefix='/api/articles') # TOUT MARCHE

    return app

def create_logger():
    return setup_logger(__name__)