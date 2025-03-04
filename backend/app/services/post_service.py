from ..models import db, Post, User
from datetime import datetime

def get_posts():
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return [{'id': p.id, 'title': p.title, 'content': p.content, 'author': p.user_id, 'created_at': p.created_at.isoformat() if p.created_at else None} for p in posts]

def get_post_by_id(post_id):
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
        'created_at': post.created_at.isoformat() if post.created_at else None,
        'updated_at': post.updated_at.isoformat() if post.updated_at else None
    }

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
    except Exception as e:
        db.session.rollback()
        return {'error': f'Failed to create post: {str(e)}'}, 500
