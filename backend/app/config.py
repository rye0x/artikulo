import os
import secrets
from dotenv import load_dotenv
from datetime import timedelta

# Load environment variables
load_dotenv()

class Config:
    # Flask configuration
    SECRET_KEY = os.getenv('SECRET_KEY', secrets.token_hex(32))
    DEBUG = os.getenv('FLASK_ENV') == 'development'

    # Database configuration
    DB_USER = os.getenv('DB_USER', 'postgres')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = os.getenv('DB_PORT', '5432')
    DB_NAME = os.getenv('DB_NAME', 'blog_site')

    # PostgreSQL connection string
    SQLALCHEMY_DATABASE_URI = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    print(f"Using PostgreSQL database: {DB_HOST}:{DB_PORT}/{DB_NAME}")

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', secrets.token_hex(32)) # fallback, if not found in .env, generate random key of 32 characters
    print(f"DEBUG - JWT Secret Key first 10 chars: {JWT_SECRET_KEY[:10]}...")
    print(f"DEBUG - JWT Secret Key length: {len(JWT_SECRET_KEY)}")
    
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ['access']
    
    # Print JWT configuration for debugging
    print("DEBUG - JWT Configuration:")
    print(f"JWT_ACCESS_TOKEN_EXPIRES: {JWT_ACCESS_TOKEN_EXPIRES}")
    print(f"JWT_BLACKLIST_ENABLED: {JWT_BLACKLIST_ENABLED}")

    # Supabase configuration for future use
    SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://zqtvmeomsnsiezevmehm.supabase.co')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY')

    # Security settings
    BCRYPT_LOG_ROUNDS = 12  # Higher is more secure but slower
