import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

class Config:
    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)

    # Supabase configuration
    SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://zqtvmeomsnsiezevmehm.supabase.co')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY')
