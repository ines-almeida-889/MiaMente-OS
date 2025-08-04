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
    // Initialize with default user for demo
    this.state = {
      user: {
        id: "parent-1",
        username: "sarah.johnson",
        role: "parent",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        createdAt: new Date(),
      },
      isAuthenticated: true,
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

    const { user } = await response.json();
    this.state = {
      user,
      isAuthenticated: true,
    };
    this.notify();
  }

  async switchRole(role: 'parent' | 'clinic' | 'insurance'): Promise<void> {
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
      insurance: {
        id: "insurance-1",
        username: "admin.ndis",
        role: "insurance" as const,
        name: "NDIS Admin",
        email: "admin@ndis.gov.au",
        createdAt: new Date(),
      },
    };

    this.state = {
      user: mockUsers[role],
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
