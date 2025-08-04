import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface User {
  id: string;
  username: string;
  email: string;
  // Add other user fields returned from the backend
}

interface AuthContextType {
  isAuthenticated: boolean;
  signin: (
    username: string,
    password: string,
    callbacks: {
      setError: (error: string) => void;
      setLoading: (loading: boolean) => void;
    }
  ) => Promise<void>;
  signup: (
    userData: Record<string, any>,
    callbacks: {
      setPopupVisibility: (visible: boolean) => void;
      setShowSuccessMessage: (show: boolean) => void;
    }
  ) => Promise<void>;
  accessToken: string | null;
  user: User | null;
  getUser: (token: string) => Promise<void>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const base_url = 'http://localhost:6542';
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('accessToken');
    setIsAuthenticated(!!token);
    setAccessToken(token || null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      getUser(accessToken);
    }
  }, [isAuthenticated, accessToken]);

  const signup = async (
    userData: Record<string, any>,
    {
      setPopupVisibility,
      setShowSuccessMessage,
    }: {
      setPopupVisibility: (visible: boolean) => void;
      setShowSuccessMessage: (show: boolean) => void;
    }
  ): Promise<void> => {
    try {
      const response = await fetch(`${base_url}/api/v1/auth/create_user`, {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Network response was not ok');
      }

      setShowSuccessMessage(true);
      setPopupVisibility(true);
      setTimeout(() => {
        setPopupVisibility(false);
        setShowSuccessMessage(false);
        navigate('/signin');
      }, 3000);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const signin = async (
    username: string,
    password: string,
    {
      setError,
      setLoading,
    }: {
      setError: (error: string) => void;
      setLoading: (loading: boolean) => void;
    }
  ): Promise<void> => {
    try {
      const response = await fetch(`${base_url}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username,
          password,
        }).toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();

      Cookies.set('userId', data.user_id, {
        expires: 1,
        secure: true,
        sameSite: 'Strict',
      });
      Cookies.set('accessToken', data.access_token, {
        expires: 1,
        secure: true,
        sameSite: 'Strict',
      });
      await getUser(data.access_token);
      setAccessToken(data.access_token);
      setIsAuthenticated(true);
      navigate('/');
    } catch (error: any) {
      console.error('Error:', error);
      setIsAuthenticated(false);
      setError(`Failed to sign in. ${error.message}`);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const getUser = async (token: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${base_url}/api/v1/auth/get_user?accessToken=${token}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData: User = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${base_url}/api/v1/auth/logout?accessToken=${accessToken}`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to logout');
      }

      Cookies.remove('accessToken');
      setAccessToken(null);
      setIsAuthenticated(false);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        signin,
        signup,
        accessToken,
        user,
        getUser,
        isLoading,
        setIsLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
