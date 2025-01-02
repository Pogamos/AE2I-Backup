from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required
from ..models.articles import Article, ArticleSchema
from ..utils.tools import check_admin_permission

bp = Blueprint('articles', __name__)
article_schema = ArticleSchema()

# GET ALL ARTICLES
@bp.route("/", methods=["GET"])
def get_articles():
    try:
        articles = Article.get_all()
        return jsonify({"success": True, "articles": articles}), 200
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# GET ARTICLE BY ID
@bp.route("/<string:article_id>", methods=["GET"])
def get_article_by_id(article_id):
    try:
        article = Article.find_by_id(article_id)
        if article:
            return jsonify({"success": True, "article": article.obj_to_json()}), 200
        else:
            return jsonify({"success": False, "message": "Article not found"}), 404
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# CREATE ARTICLE
@bp.route("/", methods=["POST"])
@jwt_required()
def create_article():
    if not check_admin_permission():
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        data = article_schema.load(request.get_json())
        article = Article(**data)
        article.save()
        return jsonify({"success": True, "message": "Article created successfully"}), 201
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# UPDATE ARTICLE
@bp.route("/<string:article_id>", methods=["PUT"])
@jwt_required()
def update_article(article_id):
    if not check_admin_permission():
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        article = Article.find_by_id(article_id)
        if not article:
            return jsonify({"success": False, "message": "Article not found"}), 404

        data = request.get_json()
        article.update(data)
        return jsonify({"success": True, "message": "Article updated successfully"}), 200
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# DELETE ARTICLE
@bp.route("/<string:article_id>", methods=["DELETE"])
@jwt_required()
def delete_article(article_id):
    if not check_admin_permission():
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        article = Article.find_by_id(article_id)
        if not article:
            return jsonify({"success": False, "message": "Article not found"}), 404

        if article.delete():
            return jsonify({"success": True, "message": "Article deleted successfully"}), 200
        else:
            return jsonify({"success": False, "message": "An error occurred"}), 500
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500