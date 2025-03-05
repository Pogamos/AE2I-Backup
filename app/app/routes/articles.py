from flask import Blueprint, jsonify, request, current_app, send_from_directory
from flask_jwt_extended import jwt_required
from ..models.articles import Article, ArticleSchema
from ..utils.tools import check_admin_permission
import os

bp = Blueprint('articles', __name__)
article_schema = ArticleSchema()

# Configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '../../uploads/articles')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# GET ALL ARTICLES
@bp.route("/", methods=["GET"])
def get_articles():
    try:
        articles = Article.get_all()
        articles_with_images = []
        for article in articles:
            article_data = article
            # Vérifiez que 'photo' est une liste avant de générer les URLs des images
            if isinstance(article['photo'], list):
                article_data['image_urls'] = [f"/api/articles/uploads/{photo}" for photo in article['photo']]
            else:
                article_data['image_urls'] = []
            articles_with_images.append(article_data)
        return jsonify({"success": True, "articles": articles_with_images}), 200
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# GET ARTICLE BY ID
@bp.route("/<string:article_id>", methods=["GET"])
def get_article_by_id(article_id):
    try:
        article = Article.find_by_id(article_id)
        if article:
            article_data = article
            # Vérifiez que 'photo' est une liste avant de générer les URLs des images
            if isinstance(article['photo'], list):
                article_data['image_urls'] = [f"/api/articles/uploads/{photo}" for photo in article['photo']]
            else:
                article_data['image_urls'] = []
            return jsonify({"success": True, "article": article_data}), 200
        else:
            return jsonify({"success": False, "message": "Article not found"}), 404
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# GET ARTICLE IMAGE
@bp.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# CREATE ARTICLE
@bp.route("/", methods=["POST"])
@jwt_required()
def create_article():
    if not check_admin_permission():
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        title = request.form.get("title")
        description = request.form.get("description")
        tags = request.form.get("tags")
        price = request.form.get("price")
        colors = request.form.getlist("colors")
        colors_code = request.form.getlist("colors_code")
        image_file = request.files.get("image")

        current_app.logger.info(f"Received data: title={title}, description={description}, tags={tags}, price={price}, colors={colors}, colors_code={colors_code}, image_file={image_file}")

        if not (title and description and tags and price and colors and colors_code and image_file):
            return jsonify({"success": False, "message": "Missing fields"}), 400

        filename = image_file.filename.replace(" ", "_")
        image_path = os.path.join(UPLOAD_FOLDER, filename)
        image_file.save(image_path)

        article_data = {
            "title": title,
            "description": description,
            "tags": tags,
            "price": price,
            "colors": colors,
            "colors_code": colors_code,
            "photo": [filename],  # Ajoutez le nom de l'image au tableau photo
        }

        article = Article(**article_data)
        article.save()
        current_app.logger.info(f"Article created successfully: {article.title}")
        return jsonify({"success": True, "message": "Article created successfully", "article_id": str(article._id)}), 201
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