from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required
from ..utils.tools import check_admin_permission
from ..models.commands import Commands, CommandsSchema
from datetime import datetime

bp = Blueprint('commands', __name__)
command_schema = CommandsSchema()

# GET ALL COMMANDS
@bp.route("/", methods=["GET"])
@jwt_required()
def get_commands():
    if not check_admin_permission():
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        commands = Commands.get_all()
        return jsonify({"success": True, "commands": commands}), 200
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# GET COMMAND BY ID
@bp.route("/<string:command_id>", methods=["GET"])
@jwt_required()
def get_command_by_id(command_id):
    if not check_admin_permission():
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        command = Commands.find_by_id(command_id)
        if command:
            return jsonify({"success": True, "command": command.obj_to_json()}), 200
        else:
            current_app.logger.error(f"Command not found: {command_id}")
            return jsonify({"success": False, "message": "Command not found"}), 404
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# CREATE COMMAND
@bp.route("/", methods=["POST"])
@jwt_required()
def create_command():
    if not check_admin_permission():
        return jsonify({"success": False, "message": "Permission denied"}), 403 
    try:
        current_app.logger.debug(f"Creating command: {request.get_json()}")
        data = command_schema.load(request.get_json())
        current_app.logger.debug(f"Data: {data}")
        data['created_at'] = datetime.now()
        command = Commands(**data)
        command.save()
        current_app.logger.info(f"Command created successfully: {command._id}")
        return jsonify({"success": True, "message": "Command created successfully", "command_id": str(command._id)}), 201
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# UPDATE COMMAND
@bp.route("/<string:command_id>", methods=["PUT"])
@jwt_required()
def update_command(command_id):
    if not check_admin_permission():
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        command = Commands.find_by_id(command_id)
        if not command:
            current_app.logger.error(f"Command not found: {command_id}")
            return jsonify({"success": False, "message": "Command not found"}), 404

        data = request.get_json()
        command.update(data)
        current_app.logger.info(f"Command updated successfully: {command_id}")
        return jsonify({"success": True, "message": "Command updated successfully"}), 200
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# DELETE COMMAND
@bp.route("/<string:command_id>", methods=["DELETE"])
@jwt_required()
def delete_command(command_id):
    if not check_admin_permission():
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        command = Commands.find_by_id(command_id)
        if not command:
            current_app.logger.error(f"Command not found: {command_id}")
            return jsonify({"success": False, "message": "Command not found"}), 404

        if command.delete():
            current_app.logger.info(f"Command deleted successfully: {command_id}")
            return jsonify({"success": True, "message": "Command deleted successfully"}), 200
        else:
            current_app.logger.error("An error occurred when deleting command")
            return jsonify({"success": False, "message": "An error occurred when deleting command"}), 500
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# GET COMMANDS BY USER ID
@bp.route("/user/<string:user_id>", methods=["GET"])
@jwt_required()
def get_commands_by_user_id(user_id):
    if not check_admin_permission():
        return jsonify({"success": False, "message": "Permission denied"}), 403 
    try:
        commands = Commands.find_by_user_id(user_id)
        return jsonify({"success": True, "commands": [command.obj_to_json() for command in commands]}), 200
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# TODO Rajouter routes soft delete et restore