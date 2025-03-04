from flask_bcrypt import check_password_hash
from flask_jwt_extended import create_access_token
from datetime import datetime
from ..extensions import bcrypt
from ..models import db, User

def register_user(data):
    if 'username' not in data or 'email' not in data or 'password' not in data:
        return {'error': 'Missing required fields'}, 400

    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return {'error': 'Email already exists'}, 409

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return {'message': 'User registered successfully'}, 201

def login_user(data):
    user = User.query.filter_by(email=data['email']).first()
    if not user or not check_password_hash(user.password, data['password']):
        return {'error': 'Invalid email or password'}, 401

    access_token = create_access_token(identity=user.id)
    return {'access_token': access_token, 'user': {'id': user.id, 'username': user.username, 'email': user.email}}, 200
