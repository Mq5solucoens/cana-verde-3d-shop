
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ADMIN_EMAIL = 'alvespereirasarahcristine@gmail.com';

interface AuthGuardProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const AuthGuard = ({ children, adminOnly = false }: AuthGuardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast({
          variant: "destructive",
          title: "Acesso restrito",
          description: "Você precisa estar logado para acessar esta página."
        });
        navigate('/login');
        return;
      }

      if (adminOnly && session.user.email !== ADMIN_EMAIL) {
        toast({
          variant: "destructive",
          title: "Acesso negado",
          description: "Você não tem permissão para acessar o painel de administração."
        });
        navigate('/');
        return;
      }

      setAllowed(true);
    });
  }, [navigate, toast, adminOnly]);

  if (!allowed) return null;
  return <>{children}</>;
};

export default AuthGuard;
