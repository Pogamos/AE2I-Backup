from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.polls import Poll, PollSchema, Response, ResponseSchema
from ..utils.tools import check_admin_permission, check_basic_permission

bp = Blueprint('polls', __name__)
poll_schema = PollSchema()
response_schema = ResponseSchema()

# GET ALL POLLS
@bp.route("/", methods=["GET"])
def get_polls():
    try:
        polls = Poll.get_all()
        return jsonify({"success": True, "polls": polls}), 200
    except Exception as e:
        current_app.logger.error(f"An error occurred while fetching polls: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# GET POLL BY ID
@bp.route("/<string:poll_id>", methods=["GET"])
def get_poll_by_id(poll_id):
    try:
        poll = Poll.find_by_id(poll_id)
        if poll:
            return jsonify({"success": True, "poll": poll.obj_to_json()}), 200
        else:
            current_app.logger.error(f"Poll not found: {poll_id}")
            return jsonify({"success": False, "message": "Poll not found"}), 404
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# CREATE NEW POLL
@bp.route("/", methods=["POST"])
@jwt_required()
def create_poll():
    if not check_admin_permission():
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        data = poll_schema.load(request.get_json())
        poll = Poll(**data)
        poll.save()
        return jsonify({"success": True, "message": "Poll created successfully", "poll": poll.obj_to_json()}), 201
    except Exception as e:
        current_app.logger.error(f"An error occurred while creating a poll: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# UPDATE POLL
@bp.route("/<string:poll_id>", methods=["PUT"])
@jwt_required()
def update_poll(poll_id):
    if not check_admin_permission():
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        poll = Poll.find_by_id(poll_id)
        if not poll:
            current_app.logger.error(f"Poll not found: {poll_id}")
            return jsonify({"success": False, "message": "Poll not found"}), 404

        data = request.get_json()
        poll.update(data)
        return jsonify({"success": True, "message": "Poll updated successfully"}), 200
    except Exception as e:
        current_app.logger.error(f"An error occurred while updating the poll: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# DELETE POLL
@bp.route("/<string:poll_id>", methods=["DELETE"])
@jwt_required()
def delete_poll(poll_id):
    if not check_admin_permission():
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        poll = Poll.find_by_id(poll_id)
        if not poll:
            current_app.logger.error(f"Poll not found: {poll_id}")
            return jsonify({"success": False, "message": "Poll not found"}), 404

        if poll.delete():
            return jsonify({"success": True, "message": "Poll deleted successfully"}), 200
        else:
            return jsonify({"success": False, "message": "An error occurred while deleting the poll"}), 500
    except Exception as e:
        current_app.logger.error(f"An error occurred while deleting the poll: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# GET RESPONSES BY POLL ID
@bp.route("/<string:poll_id>/responses", methods=["GET"])
@jwt_required()
def get_responses_by_poll_id(poll_id):
    try:
        responses = Response.find_by_poll_id(poll_id)
        return jsonify({"success": True, "responses": responses}), 200
    except Exception as e:
        current_app.logger.error(f"An error occurred while fetching responses: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# CREATE RESPONSE
@bp.route("/<string:poll_id>/responses", methods=["POST"])
@jwt_required()
def create_response(poll_id):
    try:
        data = request.get_json()
        poll = Poll.find_by_id(poll_id)
        if not poll:
            current_app.logger.error(f"Poll not found: {poll_id}")
            return jsonify({"success": False, "message": "Poll not found"}), 404
        
        data['user_id'] = get_jwt_identity()
        
        existing_responses = Response.find_by_poll_id(poll_id)
        if any(response['user_id'] == data['user_id'] for response in existing_responses):
            current_app.logger.error(f"Response already exists for user_id: {data['user_id']}")
            return jsonify({"success": False, "message": "Response already exists for this user"}), 400

        choices = [choice['choice_text'] for choice in poll.choices]
        if data['choice'] not in choices:
            current_app.logger.error(f"Invalid choice: {data['choice']}")
            return jsonify({"success": False, "message": "Invalid choice"}), 400

        response_data = response_schema.load({**data, "poll_id": poll_id})
        response = Response(**response_data)
        response.save()
        return jsonify({"success": True, "message": "Response created successfully", "response": response.obj_to_json()}), 201
    except Exception as e:
        current_app.logger.error(f"An error occurred while creating a response: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500
