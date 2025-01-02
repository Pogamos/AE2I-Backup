from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required
from ..utils.tools import check_admin_permission
from ..models.posts import Post, PostSchema
from datetime import datetime

bp = Blueprint('posts', __name__)
post_schema = PostSchema()

# GET ALL POSTS
@bp.route("/", methods=["GET"])
def get_posts():
    try:
        posts = Post.get_all()
        return jsonify({"success": True, "posts": posts}), 200
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# GET POST BY ID
@bp.route("/<string:post_id>", methods=["GET"])
def get_post_by_id(post_id):
    try:
        post = Post.find_by_id(post_id)
        if post:
            return jsonify({"success": True, "post": post.obj_to_json()}), 200
        else:
            current_app.logger.error(f"Post not found: {post_id}")
            return jsonify({"success": False, "message": "Post not found"}), 404
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e), str(type(post))}")
        return jsonify({"success": False, "message": str(e)}), 500

# CREATE POST
@bp.route("/", methods=["POST"])
@jwt_required()
def create_post():
    if not check_admin_permission():
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        data = post_schema.load(request.get_json())
        data['created_at'] = datetime.now()  # Add created_at timestamp
        post = Post(**data)
        post.save()
        current_app.logger.info(f"Post created successfully: {post.title}")
        return jsonify({"success": True, "message": "Post created successfully", "post_id": str(post._id)}), 201
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# UPDATE POST
@bp.route("/<string:post_id>", methods=["PUT"])
@jwt_required()
def update_post(post_id):
    if not check_admin_permission():
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        post = Post.find_by_id(post_id)
        if not post:
            current_app.logger.error(f"Post not found: {post_id}")
            return jsonify({"success": False, "message": "Post not found"}), 404

        data = request.get_json()
        post.update(data)
        current_app.logger.info(f"Post updated successfully: {post_id}")
        return jsonify({"success": True, "message": "Post updated successfully"}), 200
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# DELETE POST
@bp.route("/<string:post_id>", methods=["DELETE"])
@jwt_required()
def delete_post(post_id):
    if not check_admin_permission():
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        post = Post.find_by_id(post_id)
        if not post:
            current_app.logger.error(f"Post not found: {post_id}")
            return jsonify({"success": False, "message": "Post not found"}), 404

        if post.delete():
            current_app.logger.info(f"Post deleted successfully: {post_id}")
            return jsonify({"success": True, "message": "Post deleted successfully"}), 200
        else:
            current_app.logger.error("An error occurred when deleting post")
            return jsonify({"success": False, "message": "An error occurred when deleting post"}), 500
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)+str(type(post))}), 500

# SOFT DELETE POST
@bp.route("/<string:post_id>/soft_delete", methods=["PATCH"])
@jwt_required()
def soft_delete_post(post_id):
    if not check_admin_permission():
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        if Post.soft_delete(post_id):
            current_app.logger.info(f"Post soft deleted successfully: {post_id}")
            return jsonify({"success": True, "message": "Post soft deleted successfully"}), 200
        else:
            current_app.logger.error("An error occurred when soft-deleting post")
            return jsonify({"success": False, "message": "An error occurred when soft-deleting post"}), 500
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# RESTORE POST
@bp.route("/<string:post_id>/restore", methods=["PATCH"])
@jwt_required()
def restore_post(post_id):
    if not check_admin_permission():
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        if Post.restore(post_id):
            current_app.logger.info(f"Post restored successfully: {post_id}")
            return jsonify({"success": True, "message": "Post restored successfully"}), 200
        else:
            current_app.logger.error("An error occurred")
            return jsonify({"success": False, "message": "An error occurred"}), 500
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500
