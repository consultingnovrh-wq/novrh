import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/use-subscription';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Lock, Crown, Star, Building2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  serviceName: string;
  fallback?: ReactNode;
}

const ProtectedRoute = ({ children, serviceName, fallback }: ProtectedRouteProps) => {
  const { checkServiceAccess, hasActiveSubscription, getCurrentPlanName, plans } = useSubscription();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        setLoading(true);
        const access = await checkServiceAccess(serviceName);
        setHasAccess(access);
      } catch (error) {
        console.error('Error checking service access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [serviceName, checkServiceAccess]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Vérification de l'accès...</p>
        </div>
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  // Default access denied component
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Accès restreint
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Ce service nécessite un abonnement actif.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Plans disponibles :</h3>
            <div className="space-y-2">
              {plans.slice(1).map((plan) => (
                <div key={plan.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {plan.name === 'Basique' && <Building2 className="w-4 h-4 text-blue-600" />}
                    {plan.name === 'Premium' && <Star className="w-4 h-4 text-purple-600" />}
                    {plan.name === 'Entreprise' && <Crown className="w-4 h-4 text-yellow-600" />}
                    <span className="text-sm font-medium text-blue-900">{plan.name}</span>
                  </div>
                  <span className="text-sm text-blue-700 font-semibold">
                    {plan.price === 0 ? 'Gratuit' : `${plan.price.toLocaleString()} XOF`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Link to="/pricing" className="w-full">
              <Button className="w-full bg-primary hover:bg-primary/90">
                Voir les plans d'abonnement
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate(-1)}
            >
              Retour
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProtectedRoute;
