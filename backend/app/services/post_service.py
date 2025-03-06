from ..models import db, Post, User
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError


# Function to get all posts
def get_posts():
    try:
        posts = Post.query.order_by(Post.created_at.desc()).all()
        return [{'id': p.id, 'title': p.title, 'content': p.content, 'author': p.user_id, 'created_at': p.created_at.isoformat() if p.created_at else None} for p in posts], 200
    except SQLAlchemyError as e:
        return {'error': f'Database error: {str(e)}'}, 500


# Function to get a post by ID
def get_post_by_id(post_id):
    try:
        post = Post.query.get(post_id)
        if not post:
            return {'error': 'Post not found'}, 404

        author = User.query.get(post.user_id)
        author_name = author.username if author else "Unknown"

        return {
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'author_id': post.user_id,
            'author_name': author_name,
            'image_url': post.image_url,
            'created_at': post.created_at.isoformat() if post.created_at else None,
            'updated_at': post.updated_at.isoformat() if post.updated_at else None
        }, 200
    except SQLAlchemyError as e:
        return {'error': f'Database error: {str(e)}'}, 500

# Function to create a new post
def create_post(user_id, data):
    try:
        new_post = Post(
            title=data['title'],
            content=data['content'],
            user_id=user_id,
            created_at=datetime.utcnow(),
            image_url=data.get('image_url')
        )
        db.session.add(new_post)
        db.session.commit()
        return {'message': 'Post created successfully', 'post_id': new_post.id}, 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return {'error': f'Failed to create post: {str(e)}'}, 500

# Function to update a post
def update_post(post_id, user_id, data):
    try:
        post = Post.query.get(post_id)

        if not post:
            return {'error': 'Post not found'}, 404

        # Check if the user is the author of the post
        if post.user_id != user_id:
            return {'error': 'Unauthorized: You can only update your own posts'}, 403

        # Update post fields
        if 'title' in data:
            post.title = data['title']
        if 'content' in data:
            post.content = data['content']
        if 'image_url' in data:
            post.image_url = data['image_url']

        post.updated_at = datetime.utcnow()

        db.session.commit()
        return {'message': 'Post updated successfully', 'post_id': post.id}, 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return {'error': f'Failed to update post: {str(e)}'}, 500

# Function to delete a post
def delete_post(post_id, user_id):
    try:
        post = Post.query.get(post_id)

        if not post:
            return {'error': 'Post not found'}, 404

        # Check if the user is the author of the post
        if post.user_id != user_id:
            return {'error': 'Unauthorized: You can only delete your own posts'}, 403

        db.session.delete(post)
        db.session.commit()
        return {'message': 'Post deleted successfully'}, 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return {'error': f'Failed to delete post: {str(e)}'}, 500

# Function to get posts by user ID
def get_posts_by_user_id(user_id):
    try:
        posts = Post.query.filter_by(user_id=user_id).order_by(Post.created_at.desc()).all()
        
        if not posts:
            return {'posts': []}, 200
            
        result = []
        for post in posts:
            author = User.query.get(post.user_id)
            author_name = author.username if author else "Unknown"
            
            result.append({
                'id': post.id,
                'title': post.title,
                'content': post.content,
                'author_id': post.user_id,
                'author_name': author_name,
                'image_url': post.image_url,
                'created_at': post.created_at.isoformat() if post.created_at else None,
                'updated_at': post.updated_at.isoformat() if post.updated_at else None
            })
            
        return {'posts': result}, 200
    except SQLAlchemyError as e:
        return {'error': f'Database error: {str(e)}'}, 500
