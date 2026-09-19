import { User } from '../types/student.types';
import { MOCK_FACULTY_USER } from '../data/mockData';
import { apiRequest, simulateLatency, USE_MOCK_API } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private currentUser: User | null = null;
  private token: string | null = null;

  constructor() {
    // Restore session from localStorage if available
    const savedUser = localStorage.getItem('bytenight_user');
    const savedToken = localStorage.getItem('bytenight_token');
    if (savedUser && savedToken) {
      try {
        this.currentUser = JSON.parse(savedUser);
        this.token = savedToken;
      } catch {
        this.clearSession();
      }
    }
  }

  // Corresponds to POST /api/auth/login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (!USE_MOCK_API) {
      try {
        const response = await apiRequest<AuthResponse>('/auth/login', {
          method: 'POST',
          body: JSON.stringify(credentials),
        });
        this.saveSession(response.user, response.token);
        return response;
      } catch (err: any) {
        throw err;
      }
    }

    await simulateLatency(300);
    const { email, password } = credentials;

    // Faculty demo credentials check
    if (email === 'prof.smith@university.edu' && password === 'Password123') {
      const user = MOCK_FACULTY_USER;
      const token = 'mock_jwt_faculty_token_sarah_smith_2026';
      this.saveSession(user, token);
      return { user, token };
    }

    throw new Error('Invalid email or password. Use demo credentials shown below.');
  }

  // Corresponds to GET /api/auth/me
  async getCurrentUser(): Promise<User | null> {
    if (!USE_MOCK_API && this.token) {
      try {
        const user = await apiRequest<User>('/auth/me');
        this.currentUser = user;
        localStorage.setItem('bytenight_user', JSON.stringify(user));
        return user;
      } catch {
        // Fallback to locally saved user
      }
    }

    await simulateLatency(100);
    return this.currentUser;
  }

  logout(): void {
    this.clearSession();
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private saveSession(user: User, token: string): void {
    this.currentUser = user;
    this.token = token;
    localStorage.setItem('bytenight_user', JSON.stringify(user));
    localStorage.setItem('bytenight_token', token);
  }

  private clearSession(): void {
    this.currentUser = null;
    this.token = null;
    localStorage.removeItem('bytenight_user');
    localStorage.removeItem('bytenight_token');
  }
}

export const authService = new AuthService();
