from flask import Blueprint, jsonify, request, current_app, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.events import Event, EventSchema
from datetime import datetime
from ..utils.tools import check_admin_permission
import os

bp = Blueprint('events', __name__)
event_schema = EventSchema()

# Configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '../../uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# GET THE USER TOKEN
@bp.route("/token", methods=["GET"])
@jwt_required()
def get_token():
    user_data = get_jwt_identity()
    return jsonify({"success": True, "user": user_data}), 200

# GET EVENT IMAGE
@bp.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# CREATE EVENT
@bp.route("/", methods=["POST"])
@jwt_required()
def create_event():
    if not check_admin_permission():
        return jsonify({"success": False, "message": "Permission denied"}), 403
    try:
        title = request.form.get("title")
        description = request.form.get("description")
        date_str = request.form.get("date")
        if not (title and description and date_str):
            return jsonify({"success": False, "message": "Missing fields"}), 400
        
        try:
            date = datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%S')
        except ValueError:
            return jsonify({"success": False, "message": "Invalid date format"}), 400

        image_file = request.files.get("image")
        if not image_file:
            return jsonify({"success": False, "message": "Image is required"}), 400

        filename = title.replace(" ", "_") + "." + request.form.get("image_ext")
        image_path = os.path.join(UPLOAD_FOLDER, filename)
        image_file.save(image_path)
        
        event_data = {
            "title": title,
            "description": description,
            "date": date,
        }
        
        event = Event(**event_data)
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
        events_with_images = []
        for event in events:
            truncated_title = event['title'].replace(" ", "_")
            event_data = event_schema.dump(event)
            event_data['id'] = str(event['_id'])
            event_data['image_url'] = f"/api/events/uploads/{truncated_title}.svg"
            events_with_images.append(event_data)
        return jsonify({"success": True, "events": events_with_images}), 200
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
