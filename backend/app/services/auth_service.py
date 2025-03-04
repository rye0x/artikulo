from flask_bcrypt import check_password_hash
from flask_jwt_extended import create_access_token
from datetime import datetime
from ..extensions import bcrypt
from ..models import db, User

def register_user(data):
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

        # Check if user already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return {'error': 'Email already exists'}, 409
            
        existing_username = User.query.filter_by(username=data['username']).first()
        if existing_username:
            return {'error': 'Username already exists'}, 409

        # Create new user
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        new_user = User(
            username=data['username'], 
            email=data['email'], 
            password=hashed_password,
            created_at=datetime.utcnow()
        )
        db.session.add(new_user)
        db.session.commit()
        
        # Generate token for immediate login
        access_token = create_access_token(identity=new_user.id)
        
        return {
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': {
                'id': new_user.id,
                'username': new_user.username,
                'email': new_user.email
            }
        }, 201
    except Exception as e:
        db.session.rollback()
        return {'error': f'Registration failed: {str(e)}'}, 500

def login_user(data):
    try:
        # Validate required fields
        if 'email' not in data or 'password' not in data:
            return {'error': 'Email and password are required'}, 400
            
        # Find user by email
        user = User.query.filter_by(email=data['email']).first()
        if not user or not check_password_hash(user.password, data['password']):
            return {'error': 'Invalid email or password'}, 401

        # Generate access token
        access_token = create_access_token(identity=user.id)
        
        return {
            'access_token': access_token, 
            'user': {
                'id': user.id, 
                'username': user.username, 
                'email': user.email
            }
        }, 200
    except Exception as e:
        return {'error': f'Login failed: {str(e)}'}, 500
