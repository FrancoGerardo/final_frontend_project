import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import type {
  User,
  LoginRequest,
  RegisterRequest,
} from "../services/authService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Componente interno para usar hooks de React Router
const AuthProviderInner: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  );

  useEffect(() => {
    const loadUser = async () => {
      const currentlyAuthenticated = authService.isAuthenticated();
      setIsAuthenticated(currentlyAuthenticated);

      if (currentlyAuthenticated) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          authService.logout();
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    authService.setTokens(response.access_token, response.refresh_token);
    setIsAuthenticated(true);
    const userData = await authService.getCurrentUser();
    setUser(userData);
  };

  const register = async (userData: RegisterRequest) => {
    await authService.register(userData);
    await login({ email: userData.email, password: userData.password });
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const refreshUserData = async () => {
    if (isAuthenticated) {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return <AuthProviderInner>{children}</AuthProviderInner>;
};
