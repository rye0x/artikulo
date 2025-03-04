Database:
- Create a database schema for blog posts.
- Use Flask, and SQLAlchemy
- Implement database migrations and seed data.
- We will use Supabase, Postgresql as the database.
- Consider the profile or accounts of the users.
- 

API:
- Develop REST APIs for CRUD operations
- Implement error handling and validation.

## Setup Instructions

### Prerequisites
- Python 3.8+
- Supabase account with PostgreSQL database
- API key for Supabase

### Installation
1. Clone the repository
2. Navigate to the backend directory
3. Create a virtual environment:
   ```
   python -m venv .venv
   ```
4. Activate the virtual environment:
   - Windows: `.venv\Scripts\activate`
   - Linux/Mac: `source .venv/bin/activate`
5. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
6. Create a `.env` file based on `.env.example` and update with your configuration

### Supabase Setup
1. Create a Supabase account at [https://supabase.com](https://supabase.com) if you don't have one
2. Create a new project
3. Set up the following tables in your Supabase database:

**Users Table**:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(80) UNIQUE NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Posts Table**:
```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  image_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER REFERENCES users(id) NOT NULL
);
```

4. Get your Supabase URL and API key from the project settings
5. Update your `.env` file with these credentials

### Running the Application
1. Make sure your virtual environment is activated
2. Run the application:
   ```
   python main.py
   ```
3. The API will be available at `http://localhost:5000`

### API Endpoints

#### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login and get access token
- `GET /api/user` - Get user profile (requires authentication)

#### Blog Posts
- `GET /api/posts` - Get all posts (paginated)
- `GET /api/posts/<post_id>` - Get a specific post
- `POST /api/posts` - Create a new post (requires authentication)
- `PUT /api/posts/<post_id>` - Update a post (requires authentication)
- `DELETE /api/posts/<post_id>` - Delete a post (requires authentication)

#### Health Check
- `GET /api/health` - Check if the API is running
