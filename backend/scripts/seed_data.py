import os
import sys
import psycopg2
from dotenv import load_dotenv
from pathlib import Path
from flask_bcrypt import Bcrypt

# Add the parent directory to sys.path to import from app
sys.path.append(str(Path(__file__).parent.parent))

# Load environment variables
load_dotenv()

# Initialize Bcrypt
bcrypt = Bcrypt()

# Database connection parameters
DB_USER = os.getenv('DB_USER', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '5432')
DB_NAME = os.getenv('DB_NAME', 'blog_site')

def seed_data():
    """Seed the database with initial test data"""
    # Connect to our application database
    conn = psycopg2.connect(
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME
    )
    conn.autocommit = True
    cursor = conn.cursor()
    
    # Check if users already exist
    cursor.execute("SELECT COUNT(*) FROM \"user\"")
    user_count = cursor.fetchone()[0]
    
    if user_count == 0:
        # Create test users
        test_users = [
            ('admin', 'admin@example.com', bcrypt.generate_password_hash('admin123').decode('utf-8')),
            ('testuser', 'test@example.com', bcrypt.generate_password_hash('test123').decode('utf-8')),
            ('johndoe', 'john@example.com', bcrypt.generate_password_hash('john123').decode('utf-8'))
        ]
        
        for username, email, password in test_users:
            cursor.execute(
                'INSERT INTO "user" (username, email, password) VALUES (%s, %s, %s) RETURNING id',
                (username, email, password)
            )
            print(f"Created user: {username}")
    else:
        print(f"Users already exist, skipping user creation.")
    
    # Check if posts already exist
    cursor.execute("SELECT COUNT(*) FROM post")
    post_count = cursor.fetchone()[0]
    
    if post_count == 0:
        # Get user IDs
        cursor.execute('SELECT id FROM "user" LIMIT 3')
        user_ids = [row[0] for row in cursor.fetchall()]
        
        # Create test posts
        test_posts = [
            ('Getting Started with Flask', 'Flask is a lightweight WSGI web application framework in Python. It is designed to make getting started quick and easy, with the ability to scale up to complex applications.', None, user_ids[0]),
            ('PostgreSQL Best Practices', 'PostgreSQL is a powerful, open source object-relational database system with over 30 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance.', None, user_ids[0]),
            ('Web Development in 2025', 'The landscape of web development continues to evolve rapidly. This post explores the latest trends and technologies that are shaping the future of web development.', None, user_ids[1]),
            ('Building RESTful APIs', 'REST APIs provide a flexible, lightweight way to integrate applications and have emerged as the most common method for connecting components in microservices architectures.', None, user_ids[1]),
            ('User Authentication Best Practices', 'Implementing secure user authentication is critical for protecting user data and preventing unauthorized access to your application.', None, user_ids[2])
        ]
        
        for title, content, image_url, user_id in test_posts:
            cursor.execute(
                'INSERT INTO post (title, content, image_url, user_id) VALUES (%s, %s, %s, %s)',
                (title, content, image_url, user_id)
            )
            print(f"Created post: {title}")
    else:
        print(f"Posts already exist, skipping post creation.")
    
    cursor.close()
    conn.close()
    print("Seed data added successfully!")

if __name__ == "__main__":
    try:
        seed_data()
        print("Database seeding completed successfully!")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
