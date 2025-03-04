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
    DATABASE_URL = os.getenv('DATABASE_URL')
    
    # If DATABASE_URL is not set or we're in development mode, use SQLite as fallback
    if not DATABASE_URL or os.getenv('FLASK_ENV') == 'development':
        SQLALCHEMY_DATABASE_URI = 'sqlite:///blog.db'
        print("Using SQLite database for development")
    else:
        SQLALCHEMY_DATABASE_URI = DATABASE_URL
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', secrets.token_hex(32))
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ['access']

    # Supabase configuration
    SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://zqtvmeomsnsiezevmehm.supabase.co')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY')
    
    # Security settings
    BCRYPT_LOG_ROUNDS = 12  # Higher is more secure but slower
    
    # API rate limiting
    RATELIMIT_DEFAULT = "100 per minute"
    RATELIMIT_STORAGE_URL = "memory://"
