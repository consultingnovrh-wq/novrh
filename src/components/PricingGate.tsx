import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Star, Zap, Building, Crown } from 'lucide-react';
import { useFeatureAccess } from '@/hooks/use-pricing';
import { FEATURES } from '@/types/pricing';

interface PricingGateProps {
  children: ReactNode;
  feature: keyof typeof FEATURES;
  userId?: string;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
}

const PricingGate = ({ 
  children, 
  feature, 
  userId, 
  fallback, 
  showUpgradePrompt = true 
}: PricingGateProps) => {
  const { hasAccess, loading } = useFeatureAccess(userId, feature);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  const getFeatureIcon = (featureName: string) => {
    switch (featureName) {
      case 'cv_access_limited':
      case 'cv_access_unlimited':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'job_posting':
        return <Zap className="h-5 w-5 text-blue-500" />;
      case 'analytics':
        return <Building className="h-5 w-5 text-green-500" />;
      case 'api_access':
      case 'white_label':
        return <Crown className="h-5 w-5 text-purple-500" />;
      default:
        return <Lock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getUpgradeMessage = (featureName: string) => {
    switch (featureName) {
      case 'cv_coaching':
      case 'cv_review':
      case 'cv_optimization':
        return {
          title: 'Coaching CV',
          description: 'Bénéficiez d\'un coaching CV personnalisé pour maximiser vos chances',
          requiredPlan: 'Coaching CV'
        };
      case 'motivation_letter':
      case 'letter_review':
      case 'letter_optimization':
        return {
          title: 'Lettre de motivation',
          description: 'Obtenez une lettre de motivation optimisée et percutante',
          requiredPlan: 'Lettre de motivation'
        };
      case 'recruitment_complete':
        return {
          title: 'Recrutement complet',
          description: 'Bénéficiez d\'un accompagnement complet de A à Z',
          requiredPlan: 'Abonnement entreprise'
        };
      case 'job_posting':
        return {
          title: 'Publication d\'offres d\'emploi',
          description: 'Publiez vos offres d\'emploi et atteignez des milliers de candidats',
          requiredPlan: 'Abonnement entreprise'
        };
      case 'cv_access':
        return {
          title: 'Accès à la CVthèque',
          description: 'Accédez à notre base de données de CV pour trouver les meilleurs talents',
          requiredPlan: 'Abonnement entreprise'
        };
      default:
        return {
          title: 'Service premium',
          description: 'Cette fonctionnalité nécessite un service premium',
          requiredPlan: 'Voir nos tarifs'
        };
    }
  };

  const message = getUpgradeMessage(feature);

  return (
    <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          {getFeatureIcon(feature)}
        </div>
        <CardTitle className="text-xl text-gray-700">
          {message.title}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {message.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div className="mb-4">
          <Badge variant="outline" className="text-sm">
            Plan requis: {message.requiredPlan}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Mettez à niveau votre abonnement pour accéder à cette fonctionnalité et bien plus encore.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button 
            onClick={() => window.location.href = '/pricing'}
            className="bg-primary hover:bg-primary-dark"
          >
            Voir les tarifs
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/contact'}
          >
            Contacter l'équipe
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingGate;
