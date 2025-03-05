# Blog Site Frontend

This frontend application connects to the Flask backend API and provides a user interface for the blog site.

## Technologies Used

- React 18
- React Router for navigation
- Axios for API requests
- TailwindCSS for styling
- React Context API for state management

## Features

- User authentication (login/register)
- Blog post management (create, read, update, delete)
- Responsive design for mobile and desktop
- Dark/light mode toggle

## Setup Instructions

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- Backend API running (see backend README)

### Installation

1. Navigate to the frontend directory:
   ```
   cd blog-site/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the frontend root directory:
   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your backend API URL:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Running the Application

Start the development server:
```
npm start
```

The application will be available at `http://localhost:3000`.

### Building for Production

Create an optimized production build:
```
npm run build
```

The built files will be in the `build` directory.

## Project Structure

```
src/



































































   - Check that frontend requests use the correct origin   - Ensure the backend has CORS properly configured3. **CORS Errors**:   - Ensure cookies are not being blocked   - Check browser console for token-related errors   - Clear localStorage and try logging in again2. **Authentication Issues**:   - Verify network connectivity   - Check that REACT_APP_API_URL is set correctly in .env   - Ensure the backend server is running1. **API Connection Errors**:### Common Issues## Troubleshooting- `npm run eject` - Eject from Create React App- `npm run build` - Build for production- `npm test` - Run tests- `npm start` - Start the development server## Available Scripts- `DELETE /api/posts/{post_id}` - Delete a post- `PUT /api/posts/{post_id}` - Update a post- `POST /api/posts` - Create a new post- `GET /api/posts/{post_id}` - Get a specific post- `GET /api/posts` - Get all posts### Blog Posts- `GET /api/auth/profile` - Get user profile- `POST /api/auth/login` - Login- `POST /api/auth/register` - Register a new user### AuthenticationThe frontend connects to these backend API endpoints:## API Integration6. Token refresh is handled automatically5. Axios interceptors include the token in API requests4. Protected routes check for the token3. Token is stored in localStorage2. Backend returns a JWT token1. User logs in or registers through the auth formsThe application uses JWT tokens for authentication:## Authentication Flow```└── index.js           # Entry point├── App.js             # Main app component├── utils/             # Utility functions├── services/          # API service functions├── pages/             # Page components├── hooks/             # Custom React hooks├── context/           # React context for state management│   └── posts/          # Blog post components│   ├── layout/         # Layout components│   ├── auth/           # Authentication related components├── components/         # Reusable UI components
