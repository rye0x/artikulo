interface AuthResponse {
  access_token: string;
  user: {
    email: string;
    id: number;
    username: string;
  };
}

const TOKEN_KEY = 'blog_auth_token';
const USER_KEY = 'blog_user_data';

export const authService = {
  setAuth(data: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): any {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};
