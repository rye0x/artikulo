# Flask extensions initialization
# This file contains the initialization of Flask extensions used throughout the application.
# These extensions provide additional functionality such as database ORM, JWT authentication, and password hashing.

from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt

# SQLAlchemy for database ORM
db = SQLAlchemy()

# JWTManager for handling JSON Web Tokens
jwt = JWTManager()

# Bcrypt for password hashing
bcrypt = Bcrypt()
