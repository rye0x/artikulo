from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..services.auth_service import register_user, login_user

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    return jsonify(register_user(request.get_json()))

@auth_bp.route('/login', methods=['POST'])
def login():
    return jsonify(login_user(request.get_json()))

@auth_bp.route('/profile', methods=['GET'])

@jwt_required()
def profile():
    user_id = get_jwt_identity()
    return jsonify({'message': f'User ID {user_id} authenticated'})
