from flask import Flask, jsonify
from flask_cors import CORS
from .config import Config
from .extensions import db, jwt, bcrypt
from .routes.auth_routes import auth_bp
from .routes.post_routes import post_bp
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    # Enable CORS
    CORS(app)

    # Create database tables if they don't exist
    with app.app_context():
        try:
            db.create_all()
            logger.info("Database tables created successfully")
        except Exception as e:
            logger.error(f"Error creating database tables: {e}")
            logger.info("Continuing with application startup despite database error")

    # Register error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404

    @app.errorhandler(500)
    def server_error(error):
        return jsonify({'error': 'Internal server error'}), 500

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        print(f"DEBUG - Token expired. Header: {jwt_header}, Payload: {jwt_payload}")
        logger.error(f"Token expired. Payload: {jwt_payload}")
        return jsonify({'error': 'Token has expired', 'details': jwt_payload}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        print(f"DEBUG - Invalid token error: {error}")
        logger.error(f"Invalid token error: {error}")
        return jsonify({'error': f'Invalid token: {error}'}), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        print(f"DEBUG - Missing token: {error}")
        logger.error(f"Missing token: {error}")
        return jsonify({'error': f'Authorization token is missing: {error}'}), 401

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(post_bp, url_prefix='/api/posts')

    # Add a debug route to verify JWT tokens
    @app.route('/api/debug/verify-token', methods=['POST'])
    def verify_token():
        from flask import request, jsonify
        from flask_jwt_extended import decode_token
        import traceback
        
        if not request.is_json:
            return jsonify({"error": "Missing JSON in request"}), 400
            
        data = request.get_json()
        if 'token' not in data:
            return jsonify({"error": "Token is required"}), 400
            
        token = data['token']
        
        try:
            # Try to decode the token
            decoded = decode_token(token)
            return jsonify({
                "valid": True,
                "decoded": {
                    "identity": decoded.get('sub'),
                    "type": decoded.get('type'),
                    "fresh": decoded.get('fresh', False),
                    "expires": str(decoded.get('exp')),
                    "issued_at": str(decoded.get('iat')),
                    "issuer": decoded.get('iss')
                }
            }), 200
        except Exception as e:
            # Return detailed error information
            error_info = {
                "valid": False,
                "error": str(e),
                "traceback": traceback.format_exc()
            }
            return jsonify(error_info), 400

    # Health check route
    @app.route('/health', methods=['GET'])
    def health_check():
        try:
            # Test database connection
            with app.app_context():
                from sqlalchemy import text
                db.session.execute(text('SELECT 1'))
                db.session.commit()
            db_status = "connected"
        except Exception as e:
            db_status = f"error: {str(e)}"
        
        return jsonify({
            'status': 'ok',
            'database': db_status
        }), 200

    return app
