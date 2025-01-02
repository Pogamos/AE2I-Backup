from flask import Blueprint, jsonify, current_app

bp = Blueprint('base', __name__)

@bp.route('/')
def home():
    """
    Route principale (page d'accueil).
    Renvoie un message simple pour indiquer que l'API fonctionne.
    """
    return jsonify({"message": "Welcome to the AE2I API! 🥳", "status": "running"}), 200

@bp.route('/routes')
def show_routes():
    routes = []
    for rule in current_app.url_map.iter_rules():
        methods = ','.join(rule.methods)
        routes.append(f"{rule.endpoint}: {rule.rule} (Méthodes: {methods})")
    return "<br>".join(routes)