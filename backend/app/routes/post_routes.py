from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..services.post_service import get_posts, create_post, get_post_by_id

post_bp = Blueprint('posts', __name__)

@post_bp.route('/', methods=['GET'])
def fetch_posts():
    return jsonify(get_posts())

@post_bp.route('/<int:post_id>', methods=['GET'])
def get_post(post_id):
    result = get_post_by_id(post_id)
    if 'error' in result:
        return jsonify(result), 404
    return jsonify(result)

@post_bp.route('/', methods=['POST'])
@jwt_required()
def new_post():
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400
    
    data = request.get_json()
    if not data or 'title' not in data or 'content' not in data:
        return jsonify({"error": "Missing required fields"}), 400
        
    user_id = get_jwt_identity()
    return jsonify(create_post(user_id, data))
