import os
import sys
import psycopg2
from dotenv import load_dotenv
from pathlib import Path

# Add the parent directory to sys.path to import from app
sys.path.append(str(Path(__file__).parent.parent))

# Load environment variables
load_dotenv()

# Database connection parameters
DB_USER = os.getenv('DB_USER', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '5432')
DB_NAME = os.getenv('DB_NAME', 'blog_site')

def create_database():
    """Create the database if it doesn't exist"""
    # Connect to PostgreSQL server
    conn = psycopg2.connect(
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
        # Connect to 'postgres' database to create our app database
        database='postgres'
    )
    conn.autocommit = True
    cursor = conn.cursor()

    # Check if database exists
    cursor.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{DB_NAME}'")
    exists = cursor.fetchone()

    if not exists:
        print(f"Creating database '{DB_NAME}'...")
        cursor.execute(f"CREATE DATABASE {DB_NAME}")
        print(f"Database '{DB_NAME}' created successfully!")
    else:
        print(f"Database '{DB_NAME}' already exists.")

    cursor.close()
    conn.close()

def create_tables():
    """Create the necessary tables in the database"""
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

    # Create users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS "user" (
        id SERIAL PRIMARY KEY,
        username VARCHAR(80) UNIQUE NOT NULL,
        email VARCHAR(120) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Create posts table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS post (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER REFERENCES "user"(id) NOT NULL
    )
    ''')

    print("Tables created successfully!")
    cursor.close()
    conn.close()

if __name__ == "__main__":
    try:
        create_database()
        create_tables()
        print("Database initialization completed successfully!")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
