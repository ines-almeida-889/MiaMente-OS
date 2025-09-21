import { User } from "@shared/schema";

export interface AuthUser extends Omit<User, 'password'> {}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}

class AuthManager {
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
  };

  private listeners: ((state: AuthState) => void)[] = [];

  constructor() {
    // Start with clean unauthenticated state
    this.state = {
      user: null,
      isAuthenticated: false,
    };
  }

  getState(): AuthState {
    return this.state;
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  async login(username: string, password: string): Promise<void> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      
      // Set the authenticated user from the API response
      this.state = {
        user: data.user,
        isAuthenticated: true,
      };
      this.notify();
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials');
    }
  }

  async switchRole(role: 'parent' | 'clinic'): Promise<void> {
    // Mock role switching - in a real app this would be more secure
    const mockUsers = {
      parent: {
        id: "parent-1",
        username: "sarah.johnson",
        role: "parent" as const,
        name: "Sarah Johnson",
        email: "sarah@example.com",
        createdAt: new Date(),
      },
      clinic: {
        id: "clinic-1",
        username: "dr.martinez",
        role: "clinic" as const,
        name: "Dr. Martinez",
        email: "martinez@clinic.com",
        createdAt: new Date(),
      },
    };

    this.state = {
      user: mockUsers[role],
      isAuthenticated: true,
    };
    this.notify();
  }

  setAuthenticatedUser(user: AuthUser): void {
    this.state = {
      user,
      isAuthenticated: true,
    };
    this.notify();
  }

  logout(): void {
    this.state = {
      user: null,
      isAuthenticated: false,
    };
    this.notify();
  }
}

export const authManager = new AuthManager();
