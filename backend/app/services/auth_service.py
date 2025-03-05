from flask_bcrypt import check_password_hash
from flask_jwt_extended import create_access_token
from datetime import datetime
from ..extensions import bcrypt
from ..models import db, User
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
import logging

# Configure logging
logger = logging.getLogger(__name__)

# Function to register a new user
def register_user(data):
    # try and catch for database errors
    try:
        # Validate required fields
        if 'username' not in data or 'email' not in data or 'password' not in data:
            return {'error': 'Missing required fields'}, 400

        # Validate email format
        if '@' not in data['email']:
            return {'error': 'Invalid email format'}, 400

        # Validate password length
        if len(data['password']) < 6:
            return {'error': 'Password must be at least 6 characters'}, 400

        # Check if user email already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return {'error': 'Email already exists'}, 409

        # Check if username already exists
        existing_username = User.query.filter_by(username=data['username']).first()
        if existing_username:
            return {'error': 'Username already exists'}, 409

        # Create new user
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8') # generate_password_hash is a function provided by flask-bcrypt, it takes the password and returns a hashed string

        # Create a new user object with the provided data
        new_user = User(
            username=data['username'],
            email=data['email'],
            password=hashed_password,
            created_at=datetime.utcnow()
        )
        db.session.add(new_user) # Add new user to database
        db.session.commit() # Commit changes to database

        # Generate token for immediate login
        access_token = create_access_token(identity=str(new_user.id))

        # Return success response
        return {
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': {
                'id': new_user.id,
                'username': new_user.username,
                'email': new_user.email
            }
        }, 201
    except IntegrityError as e: # Integrityerror for unique constraints
        db.session.rollback()   # Rollback the session in case of error
        if 'unique constraint' in str(e.orig).lower():
            if 'username' in str(e.orig).lower():
                return {'error': 'Username already exists'}, 409
            elif 'email' in str(e.orig).lower():
                return {'error': 'Email already exists'}, 409
        return {'error': f'Registration failed due to database constraint: {str(e)}'}, 409
    except SQLAlchemyError as e:
        db.session.rollback()
        return {'error': f'Registration failed: {str(e)}'}, 500
    except Exception as e:
        db.session.rollback()
        return {'error': f'Registration failed: {str(e)}'}, 500

# Function to login a user
def login_user(data):
    try:
        # Validate required fields
        if 'email' not in data or 'password' not in data:
            logger.warning(f"Login attempt missing required fields: {data}")
            return {'error': 'Email and password are required'}, 400

        logger.info(f"Login attempt for email: {data['email']}")
        
        # Find user by email
        user = User.query.filter_by(email=data['email']).first()
        if not user:
            logger.warning(f"Login failed: User with email {data['email']} not found")
            return {'error': 'Invalid email or password'}, 401
            
        if not check_password_hash(user.password, data['password']):
            logger.warning(f"Login failed: Incorrect password for user {data['email']}")
            return {'error': 'Invalid email or password'}, 401

        # Generate access token
        logger.info(f"Generating token for user ID: {user.id}")
        # Convert user.id to string to fix "Subject must be a string" error
        access_token = create_access_token(identity=str(user.id))
        logger.info(f"Token generated successfully for user ID: {user.id}")
        
        # Print token for debugging
        print(f"DEBUG - Generated token: {access_token}")

        return {
            'access_token': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }, 200
    except SQLAlchemyError as e:
        logger.error(f"Database error during login: {str(e)}")
        return {'error': f'Login failed due to database error: {str(e)}'}, 500
    except Exception as e:
        logger.error(f"Unexpected error during login: {str(e)}")
        return {'error': f'Login failed: {str(e)}'}, 500

# Function to get user by ID
def get_user_by_id(user_id):
    try:
        logger.info(f"Getting user by ID: {user_id}")
        
        # Find user by ID
        user = User.query.get(user_id)
        if not user:
            logger.warning(f"User with ID {user_id} not found")
            return {'error': 'User not found'}, 404
            
        # Return user data
        return {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'created_at': user.created_at.isoformat() if user.created_at else None
        }, 200
    except SQLAlchemyError as e:
        logger.error(f"Database error when getting user by ID: {str(e)}")
        return {'error': f'Failed to get user: {str(e)}'}, 500
    except Exception as e:
        logger.error(f"Unexpected error when getting user by ID: {str(e)}")
        return {'error': f'Failed to get user: {str(e)}'}, 500
