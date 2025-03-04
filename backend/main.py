from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import supabase
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:password@localhost:5432/blogsite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-key')  # Change in production
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# Initialize Supabase client
SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://zqtvmeomsnsiezevmehm.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxdHZtZW9tc25zaWV6ZXZtZWhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMTY5NzgsImV4cCI6MjA1NjU5Mjk3OH0.fVez748zLqE_eQCJyxwheRFIcNMQhO5uyGHU4HEuDSo')
supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    posts = db.relationship('Post', backref='author', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    def __repr__(self):
        return f'<Post {self.title}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'image_url': self.image_url,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'author': self.author.username
        }

# Helper functions for Supabase operations
def get_user_by_email(email):
    response = supabase_client.table('users').select('*').eq('email', email).execute()
    return response.data[0] if response.data else None

def get_user_by_id(user_id):
    response = supabase_client.table('users').select('*').eq('id', user_id).execute()
    return response.data[0] if response.data else None

def get_posts(page=1, per_page=10):
    # Calculate offset
    offset = (page - 1) * per_page
    
    # Get posts with author information using a join
    response = supabase_client.table('posts')\
        .select('*, users(username)')\
        .order('created_at', desc=True)\
        .range(offset, offset + per_page - 1)\
        .execute()
    
    # Get total count
    count_response = supabase_client.table('posts').select('id', count='exact').execute()
    total = count_response.count if hasattr(count_response, 'count') else len(response.data)
    
    return response.data, total

def get_post_by_id(post_id):
    response = supabase_client.table('posts')\
        .select('*, users(username)')\
        .eq('id', post_id)\
        .execute()
    return response.data[0] if response.data else None

# Routes for User Management
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate input
    if not all(k in data for k in ('username', 'email', 'password')):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if user already exists
    existing_user = get_user_by_email(data['email'])
    if existing_user:
        return jsonify({'error': 'Email already exists'}), 409
    
    # Check username
    username_check = supabase_client.table('users').select('id').eq('username', data['username']).execute()
    if username_check.data:
        return jsonify({'error': 'Username already exists'}), 409
    
    # Hash password
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    
    # Create new user in Supabase
    user_data = {
        'username': data['username'],
        'email': data['email'],
        'password': hashed_password,
        'created_at': datetime.utcnow().isoformat()
    }
    
    response = supabase_client.table('users').insert(user_data).execute()
    
    if not response.data:
        return jsonify({'error': 'Failed to create user'}), 500
    
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Validate input
    if not all(k in data for k in ('email', 'password')):
        return jsonify({'error': 'Missing email or password'}), 400
    
    # Find user by email
    user = get_user_by_email(data['email'])
    
    # Check if user exists and password is correct
    if not user or not bcrypt.check_password_hash(user['password'], data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Create access token
    access_token = create_access_token(identity=user['id'])
    
    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user['id'],
            'username': user['username'],
            'email': user['email']
        }
    }), 200

@app.route('/api/user', methods=['GET'])
@jwt_required()
def get_user_profile():
    user_id = get_jwt_identity()
    user = get_user_by_id(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Remove password from response
    user.pop('password', None)
    
    return jsonify(user), 200

# Routes for Blog Posts
@app.route('/api/posts', methods=['GET'])
def get_all_posts():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    posts, total = get_posts(page, per_page)
    
    # Format posts
    formatted_posts = []
    for post in posts:
        formatted_post = {
            'id': post['id'],
            'title': post['title'],
            'content': post['content'],
            'image_url': post.get('image_url'),
            'created_at': post['created_at'],
            'updated_at': post['updated_at'],
            'author': post['users']['username']
        }
        formatted_posts.append(formatted_post)
    
    return jsonify({
        'posts': formatted_posts,
        'total': total,
        'pages': (total + per_page - 1) // per_page,
        'current_page': page
    }), 200

@app.route('/api/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    post = get_post_by_id(post_id)
    
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    
    # Format post
    formatted_post = {
        'id': post['id'],
        'title': post['title'],
        'content': post['content'],
        'image_url': post.get('image_url'),
        'created_at': post['created_at'],
        'updated_at': post['updated_at'],
        'author': post['users']['username']
    }
    
    return jsonify(formatted_post), 200

@app.route('/api/posts', methods=['POST'])
@jwt_required()
def create_post():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate input
    if not all(k in data for k in ('title', 'content')):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Create new post
    post_data = {
        'title': data['title'],
        'content': data['content'],
        'image_url': data.get('image_url'),
        'user_id': user_id,
        'created_at': datetime.utcnow().isoformat(),
        'updated_at': datetime.utcnow().isoformat()
    }
    
    response = supabase_client.table('posts').insert(post_data).execute()
    
    if not response.data:
        return jsonify({'error': 'Failed to create post'}), 500
    
    # Get the created post with author information
    new_post = get_post_by_id(response.data[0]['id'])
    
    # Format post
    formatted_post = {
        'id': new_post['id'],
        'title': new_post['title'],
        'content': new_post['content'],
        'image_url': new_post.get('image_url'),
        'created_at': new_post['created_at'],
        'updated_at': new_post['updated_at'],
        'author': new_post['users']['username']
    }
    
    return jsonify(formatted_post), 201

@app.route('/api/posts/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_post(post_id):
    user_id = get_jwt_identity()
    post = get_post_by_id(post_id)
    
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    
    if post['user_id'] != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    # Update post fields
    update_data = {}
    if 'title' in data:
        update_data['title'] = data['title']
    if 'content' in data:
        update_data['content'] = data['content']
    if 'image_url' in data:
        update_data['image_url'] = data['image_url']
    
    update_data['updated_at'] = datetime.utcnow().isoformat()
    
    response = supabase_client.table('posts').update(update_data).eq('id', post_id).execute()
    
    if not response.data:
        return jsonify({'error': 'Failed to update post'}), 500
    
    # Get the updated post with author information
    updated_post = get_post_by_id(post_id)
    
    # Format post
    formatted_post = {
        'id': updated_post['id'],
        'title': updated_post['title'],
        'content': updated_post['content'],
        'image_url': updated_post.get('image_url'),
        'created_at': updated_post['created_at'],
        'updated_at': updated_post['updated_at'],
        'author': updated_post['users']['username']
    }
    
    return jsonify(formatted_post), 200

@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    user_id = get_jwt_identity()
    post = get_post_by_id(post_id)
    
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    
    if post['user_id'] != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    response = supabase_client.table('posts').delete().eq('id', post_id).execute()
    
    if not response.data:
        return jsonify({'error': 'Failed to delete post'}), 500
    
    return jsonify({'message': 'Post deleted successfully'}), 200

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.getenv('PORT', 5000)))