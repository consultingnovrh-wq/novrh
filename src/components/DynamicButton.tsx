import { Button } from "@/components/ui/button";
import { useDynamicActions } from "@/hooks/use-dynamic-actions";
import { 
  Briefcase, 
  FileText, 
  Building2, 
  Search, 
  Users, 
  BookOpen, 
  CreditCard,
  User,
  LogIn,
  UserPlus
} from "lucide-react";

interface DynamicButtonProps {
  action: 'post-job' | 'add-cv' | 'add-company' | 'view-jobs' | 'view-cvtheque' | 'view-services' | 'view-pricing' | 'register' | 'login' | 'dashboard';
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

const DynamicButton = ({ 
  action, 
  variant = 'default', 
  size = 'default', 
  className = '', 
  children,
  showIcon = true 
}: DynamicButtonProps) => {
  const {
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
    isAuthenticated,
    userType
  } = useDynamicActions();

  const getActionHandler = () => {
    switch (action) {
      case 'post-job':
        return handlePostJob;
      case 'add-cv':
        return handleAddCV;
      case 'add-company':
        return handleAddCompany;
      case 'view-jobs':
        return handleViewJobs;
      case 'view-cvtheque':
        return handleViewCVTheque;
      case 'view-services':
        return handleViewServices;
      case 'view-pricing':
        return handleViewPricing;
      case 'register':
        return handleRegister;
      case 'login':
        return handleLogin;
      case 'dashboard':
        return handleDashboard;
      default:
        return () => {};
    }
  };

  const getIcon = () => {
    if (!showIcon) return null;

    switch (action) {
      case 'post-job':
        return <Briefcase className="w-4 h-4" />;
      case 'add-cv':
        return <FileText className="w-4 h-4" />;
      case 'add-company':
        return <Building2 className="w-4 h-4" />;
      case 'view-jobs':
        return <Search className="w-4 h-4" />;
      case 'view-cvtheque':
        return <Users className="w-4 h-4" />;
      case 'view-services':
        return <BookOpen className="w-4 h-4" />;
      case 'view-pricing':
        return <CreditCard className="w-4 h-4" />;
      case 'register':
        return <UserPlus className="w-4 h-4" />;
      case 'login':
        return <LogIn className="w-4 h-4" />;
      case 'dashboard':
        return <User className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getButtonText = () => {
    if (children) return children;

    switch (action) {
      case 'post-job':
        return isAuthenticated && userType === 'company' ? 'Publier une offre' : 'Publier une offre';
      case 'add-cv':
        return isAuthenticated && (userType === 'candidate' || userType === 'student') ? 'Ajouter mon CV' : 'Ajouter mon CV';
      case 'add-company':
        return isAuthenticated && userType === 'company' ? 'Présenter mon entreprise' : 'Présenter mon entreprise';
      case 'view-jobs':
        return 'Consulter les offres';
      case 'view-cvtheque':
        return 'Accéder à la CVthèque';
      case 'view-services':
        return 'Consulter les services';
      case 'view-pricing':
        return 'Voir nos tarifs';
      case 'register':
        return isAuthenticated ? `Bonjour ${userType === 'company' ? 'Entreprise' : userType === 'candidate' ? 'Candidat' : 'Utilisateur'} !` : 'S\'inscrire';
      case 'login':
        return 'Se connecter';
      case 'dashboard':
        return isAuthenticated ? 'Mon tableau de bord' : 'Se connecter';
      default:
        return action;
    }
  };

  const isDisabled = () => {
    if (!isAuthenticated) {
      // Actions qui nécessitent une connexion
      return ['post-job', 'add-cv', 'add-company', 'view-cvtheque', 'dashboard'].includes(action);
    }

    // Vérifications spécifiques selon le type d'utilisateur
    switch (action) {
      case 'post-job':
        return userType !== 'company';
      case 'add-cv':
        return userType !== 'candidate' && userType !== 'student';
      case 'add-company':
        return userType !== 'company';
      case 'view-cvtheque':
        return userType !== 'company';
      default:
        return false;
    }
  };

  return (
    <Button
      onClick={getActionHandler()}
      variant={variant}
      size={size}
      className={className}
      disabled={isDisabled()}
    >
      {getIcon() && <span className="mr-2">{getIcon()}</span>}
      {getButtonText()}
    </Button>
  );
};

export default DynamicButton;
