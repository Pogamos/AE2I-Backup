# from flask import Flask, jsonify, request
# from pymongo import MongoClient
# from bson import ObjectId
# from marshmallow import ValidationError
# from datetime import datetime
# from schemas import UserSchema, PollSchema, ResponseSchema, EventSchema, PostSchema, ArticleSchema, CartItemSchema
# from log_config import setup_logger
# import os


# ################################################################################################
# #                                TODO                                                          #
# # 1. Ajouter systeme de token (JWT) pour authentification des utilisateurs                     #
# # 2. Ajouter fonctions pour login et logout des utilisateurs                                   #
# # 3. Ajouter autres collections (articles etc...)                                              #
# # 4. Diviser routes dans plusieurs fichiers                                                    #
# #                                                                                              #
# ################################################################################################

# user_schema = UserSchema()
# poll_schema = PollSchema()
# response_schema = ResponseSchema()
# event_schema = EventSchema()
# post_schema = PostSchema()
# article_schema = ArticleSchema()
# cart_item_schema = CartItemSchema()

# logger = setup_logger(__name__)

# app = Flask(__name__)

# # Connexion à MongoDB
# mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/ae2iDB")
# client = MongoClient(mongo_uri)
# db = client.get_database()

# # Middleware pour logger les requêtes
# @app.before_request
# def log_request_info():
#     request_ip = request.remote_addr
#     method = request.method
#     url = request.url
#     current_app.logger.info(f'{request_ip} - - "{method} {url}"')



# @app.route("/api")
# def index():
#     current_app.logger.info("Accessed the index route")
#     return jsonify({"message": "Welcome to the Flask API!"})

# ################################## USERS ##################################################################################################################################

# # GET ALL USERS
# @app.route("/api/users", methods=["GET"])
# def get_users():
#     try:
#         users = db.users.find()
#         return jsonify(user_schema.dump(list(users), many=True)), 200
#     except Exception as e:
#         current_app.logger.error(f"Error while retrieving users: {e}")
#         return jsonify({"message": str(e)}), 500

# # INSERT USER
# @app.route('/api/users', methods=['POST'])
# def add_user():
#     data = request.get_json()
#     try:
#         user_data = user_schema.load(data)
#         if db.users.find_one({"mail": user_data["mail"]}):
#             current_app.logger.warning("Attempt to create a user with an existing email")
#             return jsonify({"message": "Email already exists"}), 400
        
#         user_data["password"] = hash(user_data["password"])
#         db.users.insert_one(user_data)
#         current_app.logger.info(f"User created successfully: {user_data['mail']}")
#         return jsonify({"message": "User created successfully", "user": user_schema.dump(user_data)}), 201
#     except ValidationError as err:
#         current_app.logger.warning(f"Validation error while creating user: {err.messages}")
#         return jsonify(err.messages), 400
#     except Exception as e:
#         current_app.logger.error(f"Unexpected error while creating user: {e}")
#         return jsonify({"message": str(e)}), 500

# # GET USER BY ID
# @app.route('/api/users/<id>', methods=['GET'])
# def get_user(id):
#     try:
#         user = db.users.find_one({"_id": ObjectId(id)})
#         if not user:
#             current_app.logger.warning(f"User with ID {id} not found")
#             return jsonify({"message": "User not found"}), 404
#         user["_id"] = str(user["_id"])
#         current_app.logger.info(f"Retrieved user with ID {id}")
#         return jsonify(user_schema.dump(user)), 200
#     except Exception as e:
#         current_app.logger.error(f"Error while retrieving user with ID {id}: {e}")
#         return jsonify({"message": str(e)}), 500

# # UPDATE USER
# @app.route('/api/users/<id>', methods=['PUT'])
# def update_user(id):
#     data = request.get_json()
#     try:
#         updated_data = user_schema.load(data, partial=True)
#         result = db.users.update_one({"_id": ObjectId(id)}, {"$set": updated_data})
#         if result.matched_count == 0:
#             current_app.logger.warning(f"Attempt to update non-existing user with ID {id}")
#             return jsonify({"message": "User not found"}), 404
#         updated_user = db.users.find_one({"_id": ObjectId(id)})
#         updated_user["_id"] = str(updated_user["_id"])
#         current_app.logger.info(f"User with ID {id} updated successfully")
#         return jsonify({"message": "User updated successfully", "user": updated_user}), 200
#     except ValidationError as err:
#         current_app.logger.warning(f"Validation error while updating user: {err.messages}")
#         return jsonify(err.messages), 400
#     except Exception as e:
#         current_app.logger.error(f"Error while updating user with ID {id}: {e}")
#         return jsonify({"message": str(e)}), 500

# # DELETE USER
# @app.route('/api/users/<id>', methods=['DELETE'])
# def delete_user(id):
#     try:
#         result = db.users.delete_one({"_id": ObjectId(id)})
#         if result.deleted_count == 0:
#             current_app.logger.warning(f"Attempt to delete non-existing user with ID {id}")
#             return jsonify({"message": "User not found"}), 404
#         current_app.logger.info(f"User with ID {id} deleted successfully")
#         return jsonify({"message": "User deleted successfully"}), 200
#     except Exception as e:
#         current_app.logger.error(f"Error while deleting user with ID {id}: {e}")
#         return jsonify({"message": str(e)}), 500
    
# # GET USER CART
# @app.route('/api/users/<user_id>/cart', methods=['GET'])
# def get_cart(user_id):
#     try:
#         user = db.users.find_one({"_id": ObjectId(user_id)})
#         if not user:
#             current_app.logger.warning(f"User with ID {user_id} not found")
#             return jsonify({"message": "User not found"}), 404
#         current_app.logger.info(f"Retrieved cart for user with ID {user_id}")
#         return {"cart": user.get("cart", [])}, 200
#     except Exception as e:
#         current_app.logger.error(f"Error while retrieving user with ID {user_id}: {e}")
#         return jsonify({"message": str(e)}), 500

    
# # ADD TO CART
# @app.route('/api/users/<user_id>/cart', methods=['POST'])
# def add_to_cart(user_id):
#     try:
#         data = request.json
#         article_id = data.get("article_id")
#         quantity = data.get("quantity", 1)

#         cart_item = cart_item_schema.load({"article_id": article_id, "quantity": quantity})

#         user = db.users.find_one({"_id": user_id})
#         if not user:
#             current_app.logger.warning(f"User with ID {user_id} not found")
#             return {"error": "Utilisateur introuvable"}, 404

#         for item in user.get("cart", []):
#             if item["article_id"] == article_id:
#                 item["quantity"] += quantity
#                 break
#         else:
#             user.setdefault("cart", []).append(cart_item)

#         db.users.update_one({"_id": user_id}, {"$set": {"cart": user["cart"]}})
#         current_app.logger.info(f"Article added to cart for user with ID {user_id}")
#         return {"message": "Article ajouté au panier"}, 200

#     except ValidationError as err:
#         current_app.logger.error(f"Validation error while adding article to cart: {err.messages}")
#         return {"errors": err.messages}, 400
    
# # DELETE FROM CART
# @app.route('/api/users/<user_id>/cart/<article_id>', methods=['DELETE'])
# def remove_from_cart(user_id, article_id):
#     try:
#         user = db.users.find_one({"_id": ObjectId(user_id)})
#         if not user:
#             current_app.logger.warning(f"User with ID {user_id} not found")
#             return {"error": "Utilisateur introuvable"}, 404

#         updated_cart = [item for item in user.get("cart", []) if item["article_id"] != article_id]

#         db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"cart": updated_cart}})
#         current_app.logger.info(f"Article with ID {article_id} removed from cart for user with ID {user_id}")
#         return {"message": "Article supprimé du panier"}, 200
#     except Exception as e:
#         current_app.logger.error(f"Error while removing article from cart for user with ID {user_id}: {e}")
#         return {"error": str(e)}, 500

# # FLUSH CART
# @app.route('/api/users/<user_id>/cart', methods=['DELETE'])
# def clear_cart(user_id):
#     try:
#         result = db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"cart": []}})
#         if result.matched_count == 0:
#             current_app.logger.warning(f"Attempt to clear cart for non-existing user with ID {user_id}")
#             return {"error": "Utilisateur introuvable"}, 404
#         current_app.logger.info(f"Cart cleared for user with ID {user_id}")
#         return {"message": "Panier vidé"}, 200
#     except Exception as e:
#         current_app.logger.error(f"Error while clearing cart for user with ID {user_id}: {e}")
#         return {"error": str(e)}, 500


# ################################## SONDAGES ##################################################################################################################################
    
# # INSERT POLL

# @app.route('/api/polls', methods=['POST'])
# def create_poll():
#     try:
#         data = poll_schema.load(request.json)

#         for choice in data["choices"]:
#             if "_id" not in choice or not choice["_id"]:
#                 choice["_id"] = str(ObjectId())
        
#         data["created_at"] = datetime.now()

#         result = db.polls.insert_one(data)
#         created_poll = db.polls.find_one({"_id": result.inserted_id})
#         current_app.logger.info(f"Poll created successfully: {created_poll['titre']}")
#         return poll_schema.dump(created_poll), 201

#     except ValidationError as err:
#         current_app.logger.error(f"Validation error while creating poll: {err.messages}")
#         return {"errors": err.messages}, 400
    
# #---------OLD----------------------------------------------------------------
# # @app.route('/api/polls', methods=['POST'])
# # def create_poll():
# #     try:
# #         data = request.json
# #         validated_data = poll_schema.load(data)
# #         poll_id = db.polls.insert_one(validated_data).inserted_id
# #         poll = db.polls.find_one({"_id": poll_id})
# #         return jsonify(poll_schema.dump(poll)), 201
# #     except ValidationError as err:
# #         return jsonify(err.messages), 400
    
# # GET ALL POLLS
# @app.route('/api/polls', methods=['GET'])
# def get_polls():
#     polls = list(db.polls.find())
#     current_app.logger.info("Retrieved all polls")
#     return jsonify(poll_schema.dump(polls)), 200

# # INSERT RESPONSE TO POLL
# @app.route('/api/responses', methods=['POST'])
# def create_response():
#     try:
#         data = request.json
#         validated_data = response_schema.load(data)
#         response_id = db.responses.insert_one({
#             **validated_data,
#             "created_at": datetime.now()
#         }).inserted_id
#         response = db.responses.find_one({"_id": response_id})
#         current_app.logger.info(f"Response created successfully for poll {response['poll_id']}")
#         return jsonify(response_schema.dump(response)), 201
#     except ValidationError as err:
#         current_app.logger.error(f"Validation error while creating response: {err.messages}")
#         return jsonify(err.messages), 400
    
    

# # GET RESPONSES TO POLL
# @app.route('/api/polls/<poll_id>/responses', methods=['GET'])
# def get_poll_responses(poll_id):
#     try:
#         responses = list(db.responses.find({"poll_id": poll_id}))
#         current_app.logger.info(f"Retrieved responses for poll {poll_id}")
#         return jsonify(response_schema.dump(responses)), 200
#     except Exception as e:
#         current_app.logger.error(f"Error while retrieving responses for poll {poll_id}: {e}")
#         return jsonify({"message": str(e)}), 500



# ################################## POSTS ##################################################################################################################################

# # CREATE POST
# @app.route("/api/posts", methods=["POST"])
# def create_post():
#     try:
#         data = post_schema.load(request.json)
#         data["created_at"] = datetime.now()
#         result = db.posts.insert_one(data)
#         created_post = db.posts.find_one({"_id": result.inserted_id})
#         current_app.logger.info(f"Post created successfully: {created_post['title']}")
#         return post_schema.dump(created_post), 201
#     except ValidationError as err:
#         current_app.logger.error(f"Validation error while creating post: {err.messages}")
#         return {"errors": err.messages}, 400

# # GET POSTS
# @app.route("/api/posts", methods=["GET"])
# def get_posts():
#     try:
#         posts = db.posts.find()
#         current_app.logger.info("Retrieved all posts")
#         return jsonify(post_schema.dump(list(posts), many=True)), 200
#     except Exception as e:
#         current_app.logger.error(f"Error while retrieving posts: {e}")
#         return jsonify({"message": str(e)}), 500

# # GET POST BY ID
# @app.route("/api/posts/<post_id>", methods=["GET"])
# def get_post(post_id):
#     try:
#         post = db.posts.find_one({"_id": ObjectId(post_id)})
#         if not post:
#             current_app.logger.warning(f"Post with ID {post_id} not found")
#             return {"error": "Post not found"}, 404
#         current_app.logger.info(f"Retrieved post with ID {post_id}")
#         return post_schema.dump(post), 200
#     except Exception as e:
#         current_app.logger.error(f"Error while retrieving post with ID {post_id}: {e}")
#         return {"error": str(e)}, 500

# # UPDATE POST
# @app.route("/api/posts/<post_id>", methods=["PUT"])
# def update_post(post_id):
#     try:
#         data = post_schema.load(request.json, partial=True)
#         result = db.posts.update_one({"_id": ObjectId(post_id)}, {"$set": data})
#         if result.matched_count == 0:
#             current_app.logger.warning(f"Post with ID {post_id} not found")
#             return {"error": "Post not found"}, 404
#         updated_post = db.posts.find_one({"_id": ObjectId(post_id)})
#         current_app.logger.info(f"Post with ID {post_id} updated successfully")
#         return post_schema.dump(updated_post), 200
#     except ValidationError as err:
#         current_app.logger.error(f"Validation error while updating post: {err.messages}")
#         return {"errors": err.messages}, 400
#     except Exception as e:
#         current_app.logger.error(f"Error while updating post with ID {post_id}: {e}")
#         return {"error": str(e)}, 500

# # DELETE POST
# @app.route("/api/posts/<post_id>", methods=["DELETE"])
# def delete_post(post_id):
#     try:
#         post = db.posts.find_one({"_id": ObjectId(post_id)})
#         if not post:
#             current_app.logger.warning(f"Post with ID {post_id} not found")
#             return {"error": "Post not found"}, 404
#         db.posts.update_one({"_id": ObjectId(post_id)}, {"$set": {"deleted_at": datetime.utcnow()}})
#         current_app.logger.info(f"Post with ID {post_id} deleted (soft delete)")
#         return {"message": "Post deleted (soft delete)"}, 200
#     except Exception as e:
#         current_app.logger.error(f"Error while deleting post with ID {post_id}: {e}")
#         return {"error": str(e)}, 500

# # GET ACTIVE POSTS
# @app.route("/api/posts/active", methods=["GET"])
# def get_active_posts():
#     try:
#         posts = db.posts.find({"deleted_at": None})
#         current_app.logger.info("Retrieved all active posts")
#         return jsonify(post_schema.dump(list(posts), many=True)), 200
#     except Exception as e:
#         current_app.logger.error(f"Error while retrieving active posts: {e}")
#         return {"error": str(e)}, 500


# ################################## ARTICLE ####################################################################################################################################

# # INSERT ARTICLE
# @app.route('/api/articles', methods=['POST'])
# def create_article():
#     try:
#         data = article_schema.load(request.json)
#         result = db.articles.insert_one(data)
#         created_article = db.articles.find_one({"_id": result.inserted_id})
#         current_app.logger.info(f"Article created successfully: {created_article['title']}")
#         return article_schema.dump(created_article), 201
#     except ValidationError as err:
#         current_app.logger.error(f"Validation error while creating article: {err.messages}")
#         return {"errors": err.messages}, 400
#     except Exception as e:
#         current_app.logger.error(f"Unexpected error while creating article: {e}")
#         return {"error": str(e)}, 500

# # GET ALL ARTICLES
# @app.route('/api/articles', methods=['GET'])
# def get_all_articles():
#     try:
#         articles = db.articles.find()
#         current_app.logger.info("Retrieved all articles")
#         return {"articles": article_schema.dump(articles, many=True)}, 200
#     except Exception as e:
#         current_app.logger.error(f"Error while retrieving articles: {e}")
#         return {"error": str(e)}, 500

    
# # GET ARTICLE BY ID
# @app.route('/api/articles/<article_id>', methods=['GET'])
# def get_article(article_id):
#     try:
#         article = db.articles.find_one({"_id": ObjectId(article_id)})
#         if not article:
#             current_app.logger.warning(f"Article with ID {article_id} not found")
#             return {"error": "Article not found"}, 404
#         current_app.logger.info(f"Retrieved article with ID {article_id}")
#         return article_schema.dump(article), 200
#     except Exception as e:
#         current_app.logger.error(f"Error while retrieving article with ID {article_id}: {e}")
#         return {"error": str(e)}, 500

# # DELETE ARTICLE
# @app.route('/api/articles/<article_id>', methods=['DELETE'])
# def delete_article(article_id):
#     try:
#         result = db.articles.delete_one({"_id": ObjectId(article_id)})
#         if result.deleted_count == 0:
#             current_app.logger.warning(f"Article with ID {article_id} not found")
#             return {"error": "Article not found"}, 404
#         current_app.logger.info(f"Article with ID {article_id} deleted successfully")
#         return {"message": "Article deleted successfully"}, 200
#     except Exception as e:
#         current_app.logger.error(f"Error while deleting article with ID {article_id}: {e}")
#         return {"error": str(e)}, 500



# if __name__ == "__main__":
#     current_app.logger.info("Starting the Flask application")
#     app.run(host="0.0.0.0", port=5000, debug=True)

from app import create_app, create_logger
from flask import request, current_app
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app = create_app()

logger = create_logger()
app.logger = logger

# Middleware pour logger les requêtes
@app.before_request
def log_request_info():
    request_ip = request.remote_addr
    method = request.method
    url = request.url
    current_app.logger.info(f'{request_ip} - - "{method} {url}"')

if __name__ == '__main__':
    with app.app_context():
        current_app.logger.info("Starting the Flask application :P")
    app.run(host="0.0.0.0", port=5000,debug=True)
