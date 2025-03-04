from ..models import db, Post
from datetime import datetime

def get_posts():
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return [{'id': p.id, 'title': p.title, 'content': p.content, 'author': p.user_id} for p in posts]

def create_post(user_id, data):
    new_post = Post(title=data['title'], content=data['content'], user_id=user_id, created_at=datetime.utcnow())
    db.session.add(new_post)
    db.session.commit()
    return {'message': 'Post created successfully'}, 201
