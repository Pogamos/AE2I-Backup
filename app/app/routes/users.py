from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required
from ..models.users import User
from ..utils.tools import check_basic_permission

bp = Blueprint('users', __name__)
    
# GET ALL USERS
@bp.route("/", methods=["GET"])
@jwt_required()
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
@bp.route("/<string:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    if not check_basic_permission(user_id):
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        user = User.find_by_id(user_id)
        if not user:
            current_app.logger.error(f"User not found: {user_id}")
            return jsonify({"success": False, "message": "User not found"}), 404

        data = request.get_json()
        user.update(data)
        current_app.logger.info(f"User updated successfully: {user_id}")
        return jsonify({"success": True, "message": "User updated successfully"}), 200
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
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

# GET STAFF USERS
@bp.route('/staff', methods=['GET'])
# @jwt_required()
def get_staff_users():
    """Route pour récupérer les utilisateurs du staff."""
    try:
        users = User.get_staff_users()
        return jsonify({"success": True, "users": users}), 200
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500
