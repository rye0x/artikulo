// API utility functions for the blog site

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

// Base URL for API requests
const API_BASE_URL = 'http://localhost:5000';

// Authentication functions
export async function loginUser(credentials: LoginCredentials) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to login';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
      console.error('Login error details:', errorData);
    } catch (e: unknown) {
      // If response is not JSON, try to get text
      try {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      } catch {
        // If we can't get text either, use default error message
      }
    }
    throw new Error(errorMessage);
  }

  return await response.json();
}

export async function registerUser(userData: { username: string; email: string; password: string }) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to register';
      try {
        const errorData = await response.json();
        // Check for specific error messages from the backend
        if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }

        // Log the full error details for debugging
        console.error('Registration error details:', errorData);
      } catch (e) {
        // If response is not JSON, try to get text
        try {
          const errorText = await response.text();
          if (errorText) errorMessage = errorText;
        } catch {
          // If we can't get text either, use status code based message
          if (response.status === 409) {
            errorMessage = 'Username or email already exists';
          } else if (response.status === 400) {
            errorMessage = 'Invalid registration data';
          }
        }
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in registerUser API call:', error);
    throw error;
  }
}

export async function getUserProfile(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to get user profile');
  }

  return await response.json();
}

// Post management functions
export async function getPosts() {
  const response = await fetch(`${API_BASE_URL}/api/posts/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch posts');
  }

  return await response.json();
}

export async function getPostById(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMessage = 'Failed to fetch post';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
      console.error('Post fetch error details:', errorData);
    } catch (e) {
      // If response is not JSON, try to get text
      try {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      } catch {
        // If we can't get text either, use default error message
      }
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  console.log('API response for post:', data);
  return data;
}

export async function getMyPosts(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/posts/my-posts`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMessage = 'Failed to fetch your posts';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
      console.error('Error fetching posts:', errorData);
    } catch (e) {
      // If response is not JSON, try to get text
      try {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      } catch {
        // If we can't get text either, use default error message
      }
    }
    throw new Error(errorMessage);
  }

  return await response.json();
}

export async function createPost(token: string, postData: { title: string; content: string; image_url?: string }) {
  console.log('Creating post with API URL:', `${API_BASE_URL}/api/posts/`);
  try {
    const response = await fetch(`${API_BASE_URL}/api/posts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to create post';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If response is not JSON, try to get text
        try {
          const errorText = await response.text();
          if (errorText) errorMessage = errorText;
        } catch {
          // If we can't get text either, use default error message
        }
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in createPost API call:', error);
    throw error;
  }
}

export async function updatePost(token: string, id: string, postData: { title?: string; content?: string; image_url?: string }) {
  const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to update post';

    try {
      const errorData = await response.json();

      if (response.status === 403) {
        errorMessage = 'You do not have permission to update this post';
      } else {
        errorMessage = errorData.error || errorData.message || errorMessage;
      }

      console.error('Update post error details:', errorData);
    } catch (e: unknown) {
      // If response is not JSON, try to get text
      try {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      } catch {
        // If we can't get text either, use status code based message
        if (response.status === 403) {
          errorMessage = 'You do not have permission to update this post';
        } else if (response.status === 404) {
          errorMessage = 'Post not found';
        }
      }
    }

    throw new Error(errorMessage);
  }

  return await response.json();
}

export async function deletePost(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMessage = 'Failed to delete post';

    try {
      const errorData = await response.json();

      if (response.status === 403) {
        errorMessage = 'You do not have permission to delete this post';
      } else {
        errorMessage = errorData.error || errorData.message || errorMessage;
      }

      console.error('Delete post error details:', errorData);
    } catch (e: unknown) {
      // If response is not JSON, try to get text
      try {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      } catch {
        // If we can't get text either, use status code based message
        if (response.status === 403) {
          errorMessage = 'You do not have permission to delete this post';
        } else if (response.status === 404) {
          errorMessage = 'Post not found';
        }
      }
    }

    throw new Error(errorMessage);
  }

  return await response.json();
}
