
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './use-toast';

interface User {
  email: string;
  name?: string;
}

export const useAuthentication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthStatus = () => {
      const auth = localStorage.getItem('isAuthenticated');
      const email = localStorage.getItem('userEmail');
      const name = localStorage.getItem('userName');
      
      setIsAuthenticated(auth === 'true');
      
      if (auth === 'true' && email) {
        setUser({ email, name: name || undefined });
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    };
    
    checkAuthStatus();
    
    // Listen for storage changes to update auth state
    window.addEventListener('storage', checkAuthStatus);
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const login = (email: string, password: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // This is a mock login function - in a real app, you'd validate credentials with a backend
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
        
        // Update state
        setIsAuthenticated(true);
        setUser({ email });
        
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        });
        
        resolve(true);
      }, 1000);
    });
  };

  const register = (name: string, email: string, password: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // This is a mock register function
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', name);
        
        // Update state
        setIsAuthenticated(true);
        setUser({ email, name });
        
        toast({
          title: "Conta criada com sucesso",
          description: "Bem-vindo à Cana3D!",
        });
        
        resolve(true);
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    
    setIsAuthenticated(false);
    setUser(null);
    
    toast({
      title: "Sessão encerrada",
      description: "Você saiu da sua conta com sucesso."
    });
    
    navigate('/');
  };

  const requireAuth = (callback: () => void) => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Acesso restrito",
        description: "Você precisa estar logado para executar esta ação."
      });
      navigate('/login');
      return;
    }
    
    callback();
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    register,
    requireAuth
  };
};

export default useAuthentication;
