
import { createContext, useContext } from 'react';
import {
	type LoginInput,
	type RegisterInput,
	useCurrentUser,
	useLogin,
	useLogout,
	type UserData, useRegister,
} from '@/queries/AuthQueries.tsx'

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  isError: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginInput) => Promise<UserData>;
  logout: () => Promise<void>;
  register: (userData: RegisterInput) => Promise<UserData>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { 
    data: user, 
    isLoading, 
    isError,
    status
  } = useCurrentUser();
  
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const registerMutation = useRegister();

  const handleLogin = async (credentials: LoginInput) => {
    const result = await loginMutation.mutateAsync(credentials);
    return result;
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  const handleRegister = async (userData: RegisterInput) => {
    const result = await registerMutation.mutateAsync(userData);
    return result;
  };

  const value = {
    user: user || null,
    isLoading,
    isError,
    isAuthenticated: status === 'success' && !!user,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}