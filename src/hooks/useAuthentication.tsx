
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export const useAuthentication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: "Email ou senha incorretos.",
      });
      return false;
    }
    toast({
      title: "Login realizado com sucesso",
      description: "Bem-vindo de volta!",
    });
    return true;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: error.message,
      });
      return false;
    }
    toast({
      title: "Conta criada com sucesso",
      description: "Bem-vindo à MQ53D!",
    });
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
