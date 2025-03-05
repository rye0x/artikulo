Database:
- Create a database schema for blog posts.
- Use Flask, and SQLAlchemy
- Use PostgreSQL as the database with pgAdmin/BeeKeeper Studio for database management
- Consider the profile or accounts of the users.

API:
- Develop REST APIs for CRUD operations
- Implement error handling and validation.

## Setup Instructions

### Prerequisites
- Python 3.8+
- PostgreSQL database
- Beekeeper Studio or another PostgreSQL client

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd blog-site/backend
   ```

2. Set up a virtual environment
   ```
   python -m venv .venv
   ```

3. Activate the virtual environment
   - Windows:
     ```
     .venv\Scripts\activate
     ```
   - macOS/Linux:
     ```
     source .venv/bin/activate
     ```

4. Install dependencies
   ```
   pip install -r requirements.txt
   ```

5. Create a `.env` file based on `.env.example` and update with your configuration
   ```
   cp .env.example .env
   ```

6. Update the `.env` file with your PostgreSQL credentials:
   ```
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=artikulo
   JWT_SECRET_KEY=your-secret-key-here
   SUPABASE_URL=your-supabase-url
   SUPABASE_KEY=your-supabase-key
   ```

### PostgreSQL Setup

1. Install PostgreSQL:
   - Windows: Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)
   - macOS: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql postgresql-contrib`

2. Install Beekeeper Studio:
   - Download and install from [beekeeperstudio.io](https://www.beekeeperstudio.io/download)

3. Create a new database:
   - Open Beekeeper Studio
   - Connect to your PostgreSQL server
   - Create a new database named `artikulo` (or whatever you specified in your .env file)

4. Initialize the database:
   ```
   python scripts/init_db.py
   ```

5. (Optional) Seed the database with test data:
   ```
   python scripts/seed_data.py
   ```

## Running the Application

Start the server:
```
python main.py
```

The API will be available at `http://localhost:5000`.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/profile` - Get user profile (requires authentication)

### Blog Posts

- `GET /api/posts` - Get all posts
- `GET /api/posts/{post_id}` - Get a specific post
- `POST /api/posts` - Create a new post (requires authentication)
  ```json
  {
    "title": "Post Title",
    "content": "Post content goes here...",
    "image_url": "https://example.com/image.jpg" (optional)
  }
  ```
- `PUT /api/posts/{post_id}` - Update a post (requires authentication)
- `DELETE /api/posts/{post_id}` - Delete a post (requires authentication)

## Testing Your API with Postman

### Setting Up Postman

1. **Install Postman**:
   - Download and install Postman from [postman.com](https://www.postman.com/downloads/)

2. **Create a new collection**:
   - Click "New" → "Collection"
   - Name it "Blog Site API"

### Testing Authentication Endpoints

#### 1. Register a New User

1. Create a new request:
   - Name: "Register User"
   - Method: POST
   - URL: `http://localhost:5000/api/auth/register`

2. Set up the request body:
   - Go to the "Body" tab
   - Select "raw" and "JSON" format
   - Add the JSON payload:
     ```json
     {
       "username": "testuser",
       "email": "test@example.com",
       "password": "securepassword123"
     }
     ```

3. Send the request:
   - You should receive a 201 status code
   - The response will include a JWT token and user information

#### 2. Login

1. Create a new request:
   - Name: "Login User"
   - Method: POST
   - URL: `http://localhost:5000/api/auth/login`

2. Set up the request body:
   - Go to the "Body" tab
   - Select "raw" and "JSON" format
   - Add the JSON payload:
     ```json
     {
       "email": "test@example.com",
       "password": "securepassword123"
     }
     ```

3. Send the request:
   - You should receive a 200 status code
   - The response will include a JWT token and user information
   - **Copy the access_token value** - you'll need this for authenticated requests

#### 3. Get User Profile

1. Create a new request:
   - Name: "Get User Profile"
   - Method: GET
   - URL: `http://localhost:5000/api/auth/profile`

2. Set up authentication:
   - Go to the "Authorization" tab
   - Select "Bearer Token" from the dropdown
   - Paste the JWT token you received from the login request

3. Send the request:
   - You should receive a 200 status code
   - The response will include the user's profile information

### Testing Blog Post Endpoints

#### 1. Create a New Post

1. Create a new request:
   - Name: "Create Post"
   - Method: POST
   - URL: `http://localhost:5000/api/posts`

2. Set up authentication:
   - Go to the "Authorization" tab
   - Select "Bearer Token" from the dropdown
   - Paste the JWT token from login

3. Set up the request body:
   - Go to the "Body" tab
   - Select "raw" and "JSON" format
   - Add the JSON payload:
     ```json
     {
       "title": "My First Blog Post",
       "content": "This is the content of my first blog post.",
       "image_url": "https://example.com/image.jpg"
     }
     ```

4. Send the request:
   - You should receive a 201 status code
   - The response will include the created post's ID
   - **Copy the post_id** for use in other requests

#### 2. Get All Posts

1. Create a new request:
   - Name: "Get All Posts"
   - Method: GET
   - URL: `http://localhost:5000/api/posts`

2. Send the request:
   - You should receive a 200 status code
   - The response will include an array of all posts

#### 3. Get a Specific Post

1. Create a new request:
   - Name: "Get Post by ID"
   - Method: GET
   - URL: `http://localhost:5000/api/posts/{post_id}`
   - Replace `{post_id}` with the actual post ID from the create post response

2. Send the request:
   - You should receive a 200 status code
   - The response will include the specific post's details

#### 4. Update a Post

1. Create a new request:
   - Name: "Update Post"
   - Method: PUT
   - URL: `http://localhost:5000/api/posts/{post_id}`
   - Replace `{post_id}` with the actual post ID

2. Set up authentication:
   - Go to the "Authorization" tab
   - Select "Bearer Token" from the dropdown
   - Paste the JWT token from login

3. Set up the request body:
   - Go to the "Body" tab
   - Select "raw" and "JSON" format
   - Add the JSON payload:
     ```json
     {
       "title": "Updated Blog Post Title",
       "content": "This is the updated content of my blog post."
     }
     ```

4. Send the request:
   - You should receive a 200 status code
   - The response will confirm the post was updated

#### 5. Delete a Post

1. Create a new request:
   - Name: "Delete Post"
   - Method: DELETE
   - URL: `http://localhost:5000/api/posts/{post_id}`
   - Replace `{post_id}` with the actual post ID

2. Set up authentication:
   - Go to the "Authorization" tab
   - Select "Bearer Token" from the dropdown
   - Paste the JWT token from login

3. Send the request:
   - You should receive a 200 status code
   - The response will confirm the post was deleted

### Tips for Testing

1. **Save your requests** in the collection for reuse
2. **Create environment variables** in Postman to store your token and base URL
3. **Test the flow** in the correct order: register → login → create/update/delete posts
4. **Check response status codes** to verify operations worked correctly
5. **Verify in the database** that changes were made correctly

### Troubleshooting

- If you get a 401 Unauthorized error, your token may have expired. Get a new token by logging in again.
- If you get a 404 Not Found error when accessing a post, make sure you're using the correct post ID.
- If you get a 500 Internal Server Error, check your server logs for more details.

## Troubleshooting JWT Authentication

If you encounter issues with JWT authentication when testing your API, here are some common problems and solutions:

### 1. "Invalid token" Error

If you receive an "Invalid token" error when accessing protected endpoints:

- **Check your JWT secret key**: Make sure your `.env` file has a consistent `JWT_SECRET_KEY` value
- **Restart your server**: After changing the JWT secret key, restart your Flask server
- **Get a fresh token**: Log in again to get a new token after server restarts
- **Check token format**: Make sure you're copying the entire token string without quotes
- **Verify header format**: The Authorization header should be exactly `Bearer your-token-here`

### 2. Token Not Being Accepted

If your token works for some endpoints but not others:

- **Try the Headers approach**: Instead of using Postman's Authorization tab, add a header:
  - Key: `Authorization`
  - Value: `Bearer your-token-here`
- **Check for token expiration**: Tokens expire after 1 day by default
- **Verify endpoint protection**: Make sure the endpoint has the `@jwt_required()` decorator

### 3. Creating Posts Issues

When creating posts with the POST method:

- **Check your request format**: The request body must be valid JSON
- **Include required fields**: Make sure to include both `title` and `content` fields
- **Verify authentication**: You must include a valid JWT token in the Authorization header
- **Check for validation errors**: The API will return specific error messages for missing fields

### 4. Environment Variables in Postman

If you're using environment variables in Postman:

- **Make sure the environment is selected**: Look for your environment name in the top-right dropdown
- **Verify variable names**: Variable names are case-sensitive (`authToken` vs `AuthToken`)
- **Check variable scope**: Global variables work differently than environment variables
- **Use proper syntax**: Variables must be referenced as `{{variableName}}`

### 5. Server-Side Debugging

If you're still having issues:

- **Check server logs**: Look for error messages in your terminal
- **Add debug logging**: Add `print()` or `logger.info()` statements to your code
- **Verify database connection**: Make sure your database is properly connected
- **Test with curl**: Try using curl commands to rule out Postman-specific issues

Remember that after making changes to your server code, you need to restart the Flask server for the changes to take effect.

## Manual Setup Steps

If you prefer to set up everything manually, follow these steps:

1. Create a `.env` file with the following content:
   ```
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=artikulo
   JWT_SECRET_KEY=your-secret-key-here
   SUPABASE_URL=your-supabase-url
   SUPABASE_KEY=your-supabase-key
   ```

2. Create the database in PostgreSQL:
   - Connect to PostgreSQL using Beekeeper Studio
   - Create a new database named `artikulo`

3. Initialize the database schema:
   ```
   python scripts/init_db.py
   ```

4. (Optional) Add sample data:
   ```
   python scripts/seed_data.py
   ```

5. Start the application:
   ```
   python main.py
   ```
