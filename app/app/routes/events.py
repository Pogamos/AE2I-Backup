from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required
from ..models.events import Event, EventSchema
from datetime import datetime
from ..utils.tools import check_admin_permission

bp = Blueprint('events', __name__)
event_schema = EventSchema()

# CREATE EVENT
@bp.route("/", methods=["POST"])
@jwt_required()
def create_event():
    if not check_admin_permission():
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        data = event_schema.load(request.get_json())
        data['date'] = datetime.strptime(data['date'], '%Y-%m-%dT%H:%M:%S')
        event = Event(**data)
        event.save()
        current_app.logger.info(f"Event created successfully: {event.title}")
        return jsonify({"success": True, "message": "Event created successfully", "event_id": str(event._id)}), 201
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# GET ALL EVENTS
@bp.route("/", methods=["GET"])
def get_events():
    try:
        events = Event.get_all()
        return jsonify({"success": True, "events": events}), 200
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# GET EVENT BY ID
@bp.route("/<string:event_id>", methods=["GET"])
def get_event_by_id(event_id):
    try:
        event = Event.find_by_id(event_id)
        if event:
            return jsonify({"success": True, "event": event}), 200
        else:
            current_app.logger.error(f"Event not found: {event_id}")
            return jsonify({"success": False, "message": "Event not found"}), 404
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# UPDATE EVENT
@bp.route("/<string:event_id>", methods=["PUT"])
@jwt_required()
def update_event(event_id):
    if not check_admin_permission():
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        event = Event.find_by_id(event_id)
        if not event:
            current_app.logger.error(f"Event not found: {event_id}")
            return jsonify({"success": False, "message": "Event not found"}), 404

        data = request.get_json()
        if 'date' in data:
            data['date'] = datetime.strptime(data['date'], '%Y-%m-%dT%H:%M:%S')
        event.update(data)
        current_app.logger.info(f"Event updated successfully: {event_id}")
        return jsonify({"success": True, "message": "Event updated successfully"}), 200
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# DELETE EVENT
@bp.route("/<string:event_id>", methods=["DELETE"])
@jwt_required()
def delete_event(event_id):
    if not check_admin_permission():
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        event = Event.find_by_id(event_id)
        if not event:
            current_app.logger.error(f"Event not found: {event_id}")
            return jsonify({"success": False, "message": "Event not found"}), 404

        if event.delete():
            current_app.logger.info(f"Event deleted successfully: {event_id}")
            return jsonify({"success": True, "message": "Event deleted successfully"}), 200
        else:
            current_app.logger.error("An error occurred when deleting event")
            return jsonify({"success": False, "message": "An error occurred when deleting event"}), 500
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# SOFT DELETE EVENT
@bp.route("/<string:event_id>/soft_delete", methods=["PATCH"])
@jwt_required()
def soft_delete_event(event_id):
    if not check_admin_permission():
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        if Event.soft_delete(event_id):
            current_app.logger.info(f"Event soft deleted successfully: {event_id}")
            return jsonify({"success": True, "message": "Event soft deleted successfully"}), 200
        else:
            current_app.logger.error("An error occurred when soft-deleting event")
            return jsonify({"success": False, "message": "An error occurred when soft-deleting event"}), 500
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# RESTORE EVENT
@bp.route("/<string:event_id>/restore", methods=["PATCH"])
@jwt_required()
def restore_event(event_id):
    if not check_admin_permission():
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        if Event.restore(event_id):
            current_app.logger.info(f"Event restored successfully: {event_id}")
            return jsonify({"success": True, "message": "Event restored successfully"}), 200
        else:
            current_app.logger.error("An error occurred")
            return jsonify({"success": False, "message": "An error occurred"}), 500
    except Exception as e:
        current_app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500
