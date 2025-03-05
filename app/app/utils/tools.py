from flask_jwt_extended import get_jwt_identity
from ..models.users import User


def check_basic_permission(user_id):
    current_user_id = get_jwt_identity()
    current_user = User.find_by_id(current_user_id)
    if current_user_id != user_id and current_user.role not in ['admin', 'superadmin']:
        return False
    return True

def check_admin_permission():
    current_user_id = get_jwt_identity()
    current_user = User.find_by_id(current_user_id)
    if current_user.role not in ['admin', 'superadmin']:
        return False
    return True

def check_super_admin_permission():
    current_user_id = get_jwt_identity()
    current_user = User.find_by_id(current_user_id)
    if current_user.role not in ['superadmin']:
        return False
    return True
