from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token,jwt_required, get_jwt_identity
from marshmallow import ValidationError
from ..models.users import User, UserSchema
from ..models.auth import LoginSchema

bp = Blueprint('auth', __name__)
user_schema = UserSchema()
login_schema = LoginSchema()


@bp.route('/register', methods=['POST'])
def register():
    try:
        data = user_schema.load(request.get_json())
    except ValidationError as err:
        return jsonify({"error": err.messages}), 400

    if User.find_by_email(data['email']):
        return jsonify({"error": "Email already registered"}), 400

    hashed_password = generate_password_hash(data['password'])

    new_user = User(
        lastName=data['lastName'],
        firstName=data['firstName'],
        email=data['email'],
        password=hashed_password,
        role=data.get('role', 'user')
    )
    new_user.save()

    current_app.logger.info(f"User registered successfully with email: {data['email']}")
    return jsonify({
        "message": "User registered successfully",
        "user": user_schema.dump(new_user.__dict__)
    }), 201


@bp.route('/login', methods=['POST'])
def login():
    try:
        data = login_schema.load(request.get_json())
    except ValidationError as err:
        return jsonify({"error": err.messages}), 400

    user = User.find_by_email(data['email'])
    if not user:
        current_app.logger.error(f"User not found: {data['email']}")
        return jsonify({"error": "Invalid email or password"}), 401

    if not check_password_hash(user['password'], data['password']):
        current_app.logger.error(f"Invalid password for user: {data['email']}")
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=str(user['_id']), additional_claims={"role": user["role"]})
    refresh_token = create_refresh_token(identity=str(user['_id']))

    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "refresh_token": refresh_token
    }), 200


@bp.route('/change_password', methods=['PUT'])
@jwt_required()
def change_password():
    data = request.get_json()
    if not data or "oldPassword" not in data or "newPassword" not in data:
        return jsonify({"error": "Données manquantes"}), 400
    current_user_id = get_jwt_identity()
    user = User.find_by_id(current_user_id)
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404
    if not check_password_hash(user.password, data['oldPassword']):
        return jsonify({"error": "Ancien mot de passe invalide"}), 400
    new_hashed = generate_password_hash(data["newPassword"])
    user.update({"password": new_hashed})
    current_app.logger.info(f"Mot de passe mis à jour pour l'utilisateur : {current_user_id}")
    return jsonify({"message": "Mot de passe modifié avec succès"}), 200
