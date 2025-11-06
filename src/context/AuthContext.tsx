import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService, User } from '../services/AuthService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AuthService.getSession().then(session => {
      if (session) {
        setUser(session.user);
        setToken(session.token);
      }
      setIsLoading(false);
    });
  }, []);

  const login = async (email: string, password: string) => {
    const { user: loggedUser, token: authToken } = await AuthService.login({ email, password });
    setUser(loggedUser);
    setToken(authToken);
  };

  const register = async (email: string, name: string, password: string) => {
    const { user: newUser, token: authToken } = await AuthService.register({ email, name, password });
    setUser(newUser);
    setToken(authToken);
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
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
