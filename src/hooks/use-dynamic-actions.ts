import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  user_type: 'candidate' | 'company' | 'student' | 'admin';
  first_name?: string;
  last_name?: string;
}

export const useDynamicActions = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          // Récupérer le profil utilisateur
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', authUser.id)
            .single();

          if (profile) {
            setUser({
              id: authUser.id,
              email: profile.email,
              user_type: profile.user_type,
              first_name: profile.first_name,
              last_name: profile.last_name
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        getUser();
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Actions dynamiques selon le type d'utilisateur
  const handlePostJob = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour publier une offre d'emploi.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (user.user_type === 'company') {
      navigate('/post-job');
    } else {
      toast({
        title: "Accès restreint",
        description: "Seules les entreprises peuvent publier des offres d'emploi.",
        variant: "destructive"
      });
    }
  };

  const handleAddCV = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter votre CV.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (user.user_type === 'candidate' || user.user_type === 'student') {
      navigate('/add-cv');
    } else {
      toast({
        title: "Accès restreint",
        description: "Seuls les candidats et étudiants peuvent ajouter un CV.",
        variant: "destructive"
      });
    }
  };

  const handleAddCompany = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour présenter votre entreprise.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (user.user_type === 'company') {
      navigate('/add-company');
    } else {
      toast({
        title: "Accès restreint",
        description: "Seules les entreprises peuvent présenter leur entreprise.",
        variant: "destructive"
      });
    }
  };

  const handleViewJobs = () => {
    navigate('/jobs');
  };

  const handleViewCVTheque = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour accéder à la CVthèque.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (user.user_type === 'company') {
      navigate('/cvtheque');
    } else {
      toast({
        title: "Accès restreint",
        description: "Seules les entreprises peuvent accéder à la CVthèque.",
        variant: "destructive"
      });
    }
  };

  const handleViewServices = () => {
    navigate('/services');
  };

  const handleViewPricing = () => {
    navigate('/pricing');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleDashboard = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    switch (user.user_type) {
      case 'candidate':
        navigate('/candidate-dashboard');
        break;
      case 'company':
        navigate('/company-dashboard');
        break;
      case 'student':
        navigate('/student-services');
        break;
      case 'admin':
        navigate('/admin');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/');
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive"
      });
    }
  };

  // Obtenir le texte du bouton selon l'état de connexion
  const getButtonText = (action: string) => {
    if (!user) {
      switch (action) {
        case 'post-job':
          return 'Publier une offre';
        case 'add-cv':
          return 'Ajouter mon CV';
        case 'add-company':
          return 'Présenter mon entreprise';
        case 'dashboard':
          return 'Se connecter';
        default:
          return action;
      }
    }

    switch (action) {
      case 'post-job':
        return user.user_type === 'company' ? 'Publier une offre' : 'Publier une offre';
      case 'add-cv':
        return user.user_type === 'candidate' || user.user_type === 'student' ? 'Ajouter mon CV' : 'Ajouter mon CV';
      case 'add-company':
        return user.user_type === 'company' ? 'Présenter mon entreprise' : 'Présenter mon entreprise';
      case 'dashboard':
        return 'Mon tableau de bord';
      default:
        return action;
    }
  };

  // Obtenir l'icône selon l'action
  const getButtonIcon = (action: string) => {
    // Les icônes seront importées dans les composants qui utilisent ce hook
    return null;
  };

  return {
    user,
    loading,
    handlePostJob,
    handleAddCV,
    handleAddCompany,
    handleViewJobs,
    handleViewCVTheque,
    handleViewServices,
    handleViewPricing,
    handleRegister,
    handleLogin,
    handleDashboard,
    handleLogout,
    getButtonText,
    getButtonIcon,
    isAuthenticated: !!user,
    userType: user?.user_type
  };
};
