from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import db, jwt, bcrypt
from .routes.auth_routes import auth_bp
from .routes.post_routes import post_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    CORS(app)  # Enable CORS for all routes

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(post_bp, url_prefix='/api/posts')

    return app
