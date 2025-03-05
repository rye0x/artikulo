from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..services.post_service import get_posts, create_post, get_post_by_id, update_post, delete_post
import logging

# Configure logging
logger = logging.getLogger(__name__)

# Post routes will handle all operations related to posts in the blog site

post_bp = Blueprint('posts', __name__)

# Route to get all posts
@post_bp.route('/', methods=['GET'])
def fetch_posts():
    result, status_code = get_posts()
    return jsonify(result), status_code

# Route to get a single post by ID
@post_bp.route('/<int:post_id>', methods=['GET'])
def get_post(post_id):
    result, status_code = get_post_by_id(post_id)
    return jsonify(result), status_code

# Route to create a new post
@post_bp.route('/', methods=['POST'])
@jwt_required() # Ensure the user is authenticated
def new_post():
    try:
        logger.info("Received POST request to create a new post")
        
        if not request.is_json:
            logger.warning("Request is not JSON format")
            return jsonify({"error": "Missing JSON in request"}), 400

        data = request.get_json()
        logger.info(f"Request data: {data}")
        
        if not data or 'title' not in data or 'content' not in data:
            logger.warning(f"Missing required fields in request: {data}")
            return jsonify({"error": "Missing required fields"}), 400

        # Get the user ID from the token (will be a string)
        user_id = get_jwt_identity()
        logger.info(f"Creating post for user ID: {user_id}")
        
        # Convert to integer for database operations
        try:
            user_id_int = int(user_id)
        except (ValueError, TypeError):
            logger.error(f"Could not convert user_id to integer: {user_id}")
            return jsonify({"error": "Invalid user ID format"}), 400
        
        result, status_code = create_post(user_id_int, data)
        logger.info(f"Post creation result: {result}, status: {status_code}")
        
        return jsonify(result), status_code
    except Exception as e:
        logger.error(f"Error creating post: {str(e)}")
        return jsonify({"error": f"Failed to create post: {str(e)}"}), 500

# Route to update an existing post
@post_bp.route('/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_existing_post(post_id):
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400

    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing data for update"}), 400

    user_id = get_jwt_identity()
    try:
        user_id_int = int(user_id)
    except (ValueError, TypeError):
        logger.error(f"Could not convert user_id to integer: {user_id}")
        return jsonify({"error": "Invalid user ID format"}), 400
    
    result, status_code = update_post(post_id, user_id_int, data)
    return jsonify(result), status_code

# Route to delete a post
@post_bp.route('/<int:post_id>', methods=['DELETE'])
@jwt_required()
def remove_post(post_id):
    user_id = get_jwt_identity()
    try:
        user_id_int = int(user_id)
    except (ValueError, TypeError):
        logger.error(f"Could not convert user_id to integer: {user_id}")
        return jsonify({"error": "Invalid user ID format"}), 400
    
    result, status_code = delete_post(post_id, user_id_int)
    return jsonify(result), status_code
