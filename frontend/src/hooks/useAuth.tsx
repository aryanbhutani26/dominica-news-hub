import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, tokenService, userService, User, LoginCredentials, RegisterData } from '../services/auth';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();

  // Query to get current user
  const {
    data: userData,
    isLoading: isUserLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    enabled: !!tokenService.getToken() && tokenService.isTokenValid(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      const { user, token } = data.data;
      tokenService.setToken(token);
      userService.setUser(user);
      setUser(user);
      queryClient.setQueryData(['currentUser'], { data: { user } });
      toast.success('Login successful!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Login failed. Please try again.';
      toast.error(message);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      const { user, token } = data.data;
      tokenService.setToken(token);
      userService.setUser(user);
      setUser(user);
      queryClient.setQueryData(['currentUser'], { data: { user } });
      toast.success('Registration successful!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Registration failed. Please try again.';
      toast.error(message);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      tokenService.removeToken();
      userService.removeUser();
      setUser(null);
      queryClient.clear();
      toast.success('Logged out successfully');
    },
    onError: () => {
      // Even if logout fails on server, clear local data
      tokenService.removeToken();
      userService.removeUser();
      setUser(null);
      queryClient.clear();
      toast.success('Logged out successfully');
    },
  });

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = () => {
      const token = tokenService.getToken();
      const savedUser = userService.getUser();

      if (token && tokenService.isTokenValid() && savedUser) {
        setUser(savedUser);
      } else {
        // Clear invalid token/user data
        tokenService.removeToken();
        userService.removeUser();
        setUser(null);
      }

      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  // Update user when query data changes
  useEffect(() => {
    if (userData?.data?.user) {
      setUser(userData.data.user);
      userService.setUser(userData.data.user);
    }
  }, [userData]);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    await loginMutation.mutateAsync(credentials);
  };

  const register = async (userData: RegisterData): Promise<void> => {
    await registerMutation.mutateAsync(userData);
  };

  const logout = async (): Promise<void> => {
    await logoutMutation.mutateAsync();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading: !isInitialized || isUserLoading || loginMutation.isPending || registerMutation.isPending,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};