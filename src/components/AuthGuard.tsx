
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const ADMIN_EMAIL = 'alvespereirasarahcristine@gmail.com';

interface AuthGuardProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const AuthGuard = ({ children, adminOnly = false }: AuthGuardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userEmail = localStorage.getItem('userEmail');

    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Acesso restrito",
        description: "Você precisa estar logado para acessar esta página."
      });
      navigate('/login');
      return;
    }

    if (adminOnly && userEmail !== ADMIN_EMAIL) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você não tem permissão para acessar o painel de administração."
      });
      navigate('/');
    }
  }, [navigate, toast, adminOnly]);

  return <>{children}</>;
};

export default AuthGuard;
