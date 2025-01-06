from flask import Blueprint, jsonify, request, current_app, send_from_directory
from flask_jwt_extended import jwt_required
from ..models.users import User
from ..utils.tools import check_basic_permission
import os

bp = Blueprint('users', __name__)

# UPLOAD PROFILE PICTURE
@bp.route('/uploads/<path:filename>', methods=["GET"])
def serve_profile_picture(filename):
    """Servir les images depuis le dossier uploads."""
    uploads_dir = os.path.abspath('./uploads')  # Chemin absolu
    return send_from_directory(uploads_dir, filename)

# GET ALL USERS
@bp.route("/", methods=["GET"])
def get_users():
    try:
        users = User.get_all()
        return jsonify({"success": True, "users": users}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# GET USER BY EMAIL
@bp.route("/<string:email>", methods=["GET"])
def get_user_by_email(email):
    try:
        user = User.find_by_email(email)
        if user:
            return jsonify({"success": True, "user": user}), 200
        else:
            current_app.logger.error(f"User not found: {email}")
            return jsonify({"success": False, "message": "User not found"}), 404
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# UPDATE USER
@bp.route("/<string:email>", methods=["PUT"])
@jwt_required()
def update_user(email):
    try:
        data = request.get_json() if request.is_json else request.form.to_dict()
        current_app.logger.info(f"Requête PUT reçue avec données : {data}")
        user = User.find_by_email(email)

        if not user:
            return jsonify({"success": False, "message": "Utilisateur non trouvé"}), 404

        # Mettre à jour le dictionnaire directement
        updated_data = {
            "firstName": data.get("firstName", user["firstName"]),
            "lastName": data.get("lastName", user["lastName"]),
            "bio": data.get("bio", user.get("bio", "")),
            "email": data.get("email", user["email"]),
        }

        if "ppicture" in request.files:
            file = request.files["ppicture"]
            file_path = f"./uploads/{email}_profile.png"
            file.save(file_path)
            updated_data["ppicture"] = file_path

        User.collection.update_one({"email": email}, {"$set": updated_data})
        current_app.logger.info(f"Utilisateur après update : {updated_data}")
        return jsonify({"success": True, "user": updated_data, "message": "Utilisateur mis à jour"}), 200

    except Exception as e:
        current_app.logger.error(f"Erreur lors de la mise à jour : {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500


# DELETE USER
@bp.route("/<string:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    if not check_basic_permission(user_id):
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        user = User.find_by_id(user_id)
        if not user:
            current_app.logger.error(f"User not found: {user_id}")
            return jsonify({"success": False, "message": "User not found"}), 404

        if user.delete():
            current_app.logger.info(f"User deleted successfully: {user_id}")
            return jsonify({"success": True, "message": "User deleted successfully"}), 200
        else:
            current_app.logger.error(f"An error occurred")
            return jsonify({"success": False, "message": "An error occurred"}), 500
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# ADD ITEM TO CART
@bp.route("/<string:user_id>/cart", methods=["POST"])
@jwt_required()
def add_to_cart(user_id):
    if not check_basic_permission(user_id):
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        item = request.get_json()
        if User.add_to_cart(user_id, item):
            current_app.logger.info(f"Item added to cart: {user_id}")
            return jsonify({"success": True, "message": "Item added to cart"}), 200
        else:
            return jsonify({"success": False, "message": "Failed to add item to cart"}), 500
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# GET USER CART
@bp.route("/<string:user_id>/cart", methods=["GET"])
@jwt_required()
def get_cart(user_id):
    if not check_basic_permission(user_id):
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        cart = User.get_cart(user_id)
        return jsonify({"success": True, "cart": cart}), 200
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# DELETE ITEM FROM CART
@bp.route("/<string:user_id>/cart/<string:item_id>", methods=["DELETE"])
@jwt_required()
def delete_from_cart(user_id, item_id):
    if not check_basic_permission(user_id):
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        if User.delete_from_cart(user_id, item_id):
            current_app.logger.info(f"Item deleted from cart: {user_id}")
            return jsonify({"success": True, "message": "Item deleted from cart"}), 200
        else:
            return jsonify({"success": False, "message": "Failed to delete item from cart"}), 500
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# FLUSH USER CART
@bp.route("/<string:user_id>/cart", methods=["DELETE"])
@jwt_required()
def flush_cart(user_id):
    if not check_basic_permission(user_id):
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        if User.flush_cart(user_id):
            current_app.logger.info(f"Cart flushed: {user_id}")
            return jsonify({"success": True, "message": "Cart flushed"}), 200
        else:
            return jsonify({"success": False, "message": "Failed to flush cart"}), 500
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500
