from flask import Blueprint, request, jsonify # Blueprint for authentication routes, request for getting JSON, jsonify for returning JSON
from flask_jwt_extended import jwt_required, get_jwt_identity # Import for JWT authentication
from ..services.auth_service import register_user, login_user, get_user_by_id # Import authentication services
import logging

logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__)

# Register route
@auth_bp.route('/register', methods=['POST'])
def register():
    # Validate JSON in request
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400 # 400 Bad Request
        # Return error if JSON is missing
    return register_user(request.get_json())

# Login route
@auth_bp.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400 # 400 Bad Request
    return login_user(request.get_json())

# Profile route
@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    try:
        # Get user ID from JWT token (will be a string)
        user_id = get_jwt_identity()
        logger.info(f"Profile accessed by user ID: {user_id}")
        
        # Convert to integer if needed for database queries
        try:
            user_id_int = int(user_id)
        except (ValueError, TypeError):
            # If conversion fails, keep original value
            user_id_int = user_id
        
        # Get user data from database
        user_data, status_code = get_user_by_id(user_id_int)
        
        if status_code != 200:
            logger.error(f"Failed to get user data: {user_data}")
            return jsonify({'error': 'Failed to get user profile'}), status_code
        
        # Return user information
        return jsonify({
            'user': {
                'id': user_data['id'],
                'username': user_data['username'],
                'email': user_data['email']
            }
        }), 200
    except Exception as e:
        logger.error(f"Error in profile route: {str(e)}")
        return jsonify({'error': f'Profile access failed: {str(e)}'}), 500
