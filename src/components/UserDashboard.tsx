import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useSubscription } from '@/hooks/use-subscription';
import { useToast } from '@/hooks/use-toast';
import { 
  Crown, 
  Star, 
  Building2, 
  User, 
  Calendar, 
  CreditCard, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Payment = Database['public']['Tables']['payments']['Row'];

const UserDashboard = () => {
  const { 
    userSubscription, 
    getCurrentPlanName, 
    hasActiveSubscription, 
    cancelSubscription,
    getPaymentHistory 
  } = useSubscription();
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPaymentHistory = async () => {
      const history = await getPaymentHistory();
      setPayments(history);
    };
    loadPaymentHistory();
  }, [getPaymentHistory]);

  const handleCancelSubscription = async () => {
    try {
      setLoading(true);
      await cancelSubscription();
      toast({
        title: "Abonnement annulé",
        description: "Votre abonnement a été annulé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'annulation de l'abonnement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case "Gratuit":
        return <User className="w-6 h-6" />;
      case "Basique":
        return <Building2 className="w-6 h-6" />;
      case "Premium":
        return <Star className="w-6 h-6" />;
      case "Entreprise":
        return <Crown className="w-6 h-6" />;
      default:
        return <User className="w-6 h-6" />;
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName) {
      case "Gratuit":
        return "bg-gray-100 text-gray-800";
      case "Basique":
        return "bg-blue-100 text-blue-800";
      case "Premium":
        return "bg-purple-100 text-purple-800";
      case "Entreprise":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>État de l'abonnement</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasActiveSubscription() ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${getPlanColor(getCurrentPlanName())}`}>
                    {getPlanIcon(getCurrentPlanName())}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{getCurrentPlanName()}</h3>
                    <p className="text-sm text-muted-foreground">
                      Abonnement actif
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  Actif
                </Badge>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">Début :</span> {formatDate(userSubscription?.start_date || '')}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">Fin :</span> {formatDate(userSubscription?.end_date || '')}
                  </span>
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleCancelSubscription}
                  disabled={loading}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  {loading ? "Annulation..." : "Annuler l'abonnement"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucun abonnement actif
              </h3>
              <p className="text-gray-600 mb-4">
                Vous utilisez actuellement le plan gratuit.
              </p>
              <Button asChild>
                <a href="/pricing">Voir les plans d'abonnement</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length > 0 ? (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(payment.status)}
                    <div>
                      <p className="font-medium">
                        {formatCurrency(payment.amount, payment.currency)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {payment.payment_method} • {formatDate(payment.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status === 'completed' && 'Complété'}
                      {payment.status === 'pending' && 'En attente'}
                      {payment.status === 'failed' && 'Échoué'}
                      {payment.status === 'refunded' && 'Remboursé'}
                    </Badge>
                    {payment.transaction_id && (
                      <span className="text-xs text-muted-foreground">
                        {payment.transaction_id}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Aucun historique de paiement disponible
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Features */}
      {hasActiveSubscription() && (
        <Card>
          <CardHeader>
            <CardTitle>Fonctionnalités incluses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userSubscription?.subscription_plans?.features && 
                (userSubscription.subscription_plans.features as string[]).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserDashboard;
