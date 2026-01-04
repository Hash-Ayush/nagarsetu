import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: Record<UserRole, User> = {
  employee: {
    id: 'emp-001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@nagarsetu.gov.in',
    role: 'employee',
    department: 'Public Works',
    designation: 'Junior Engineer',
    employeeId: 'NMC-2024-0542',
    joinDate: '2022-03-15',
    phone: '+91 98765 43210',
  },
  officer: {
    id: 'off-001',
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@nagarsetu.gov.in',
    role: 'officer',
    department: 'Public Works',
    designation: 'Executive Engineer',
    employeeId: 'NMC-2018-0128',
    joinDate: '2018-06-01',
    phone: '+91 98765 12345',
  },
  admin: {
    id: 'adm-001',
    name: 'Amit Verma',
    email: 'amit.verma@nagarsetu.gov.in',
    role: 'admin',
    department: 'Administration',
    designation: 'Municipal Commissioner',
    employeeId: 'NMC-2015-0001',
    joinDate: '2015-01-01',
    phone: '+91 98765 00001',
  },
  citizen: {
    id: 'cit-001',
    name: 'Sunita Devi',
    email: 'sunita@example.com',
    role: 'citizen',
    department: 'N/A',
    designation: 'Citizen',
    employeeId: 'N/A',
    joinDate: 'N/A',
    phone: '+91 98765 67890',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nagarsetu_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For demo, accept any credentials with correct role
    if (email && password && password.length >= 4) {
      const mockUser = mockUsers[role];
      setUser(mockUser);
      localStorage.setItem('nagarsetu_user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('nagarsetu_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
