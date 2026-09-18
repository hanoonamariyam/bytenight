import { User } from '../types/student.types';
import { MOCK_FACULTY_USER } from '../data/mockData';
import { simulateLatency } from './api';

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

  // Corresponds to POST /api/v1/auth/login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await simulateLatency(400);

    const { email, password } = credentials;

    // Faculty demo credentials check
    if (email === 'prof.smith@university.edu' && password === 'Password123!') {
      const user = MOCK_FACULTY_USER;
      const token = 'mock_jwt_faculty_token_sarah_smith_2026';
      
      this.saveSession(user, token);
      return { user, token };
    }

    // Generic test faculty credentials
    if (email.includes('@') && password.length >= 6) {
      const user: User = {
        id: 'usr_' + email.split('@')[0],
        email: email,
        fullName: email.split('@')[0].replace('.', ' ').toUpperCase(),
        role: 'FACULTY',
        department: 'Computer Science',
        assignedClasses: ['CS-101: Data Structures (Sec A)']
      };
      const token = 'mock_jwt_' + user.id;
      this.saveSession(user, token);
      return { user, token };
    }

    throw new Error('Invalid email or password. Use demo credentials shown below.');
  }

  // Corresponds to GET /api/v1/auth/me
  async getCurrentUser(): Promise<User | null> {
    await simulateLatency(150);
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
