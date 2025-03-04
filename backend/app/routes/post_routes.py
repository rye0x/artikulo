from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..services.post_service import get_posts, create_post

post_bp = Blueprint('posts', __name__)

@post_bp.route('/', methods=['GET'])
def fetch_posts():
    return jsonify(get_posts())

@post_bp.route('/', methods=['POST'])
@jwt_required()
def new_post():
    user_id = get_jwt_identity()
    return jsonify(create_post(user_id, request.get_json()))
