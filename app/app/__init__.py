from .extensions import jwt, mongo
from .config import Config
from .log_config import setup_logger
from flasgger import Swagger
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


####################################################################################################
#                                                                                                  #
#                                             TODO                                                 #
#                 -faire les tests                                                                 #
#                                                                                                  #
####################################################################################################


def create_app():
    # print("creating app :P")
    app = Flask(__name__)
    CORS(app, origins=["http://localhost:3000"])
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
    Swagger(app, config=swagger_config, template_file="./docs/swagger.yaml")

    # Enregistrement des blueprints
    from .routes import users, auth, posts, polls, articles, events, commands, base
    app.register_blueprint(base.bp, url_prefix='/api')
    app.register_blueprint(users.bp, url_prefix='/api/users') # TOUT MARCHE                   
    app.register_blueprint(auth.bp, url_prefix='/api/auth') # TOUT MARCHE                       
    app.register_blueprint(posts.bp, url_prefix='/api/posts') # TOUT MARCHE                     
    app.register_blueprint(events.bp, url_prefix='/api/events') # TOUT MARCHE
    app.register_blueprint(polls.bp, url_prefix='/api/polls') # TOUT MARCHE
    app.register_blueprint(articles.bp, url_prefix='/api/articles') # TOUT MARCHE
    app.register_blueprint(commands.bp, url_prefix='/api/commands')

    # Si jamais vous avez des questions me contacter à lucas.paugam@gmail.com voila voila :P
    return app

def create_logger():
    return setup_logger(__name__)