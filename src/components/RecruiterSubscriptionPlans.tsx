import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Crown, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Users, 
  Eye, 
  Briefcase,
  Star,
  Zap,
  Shield
} from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration_months: number;
  max_cv_views: number;
  max_job_postings: number;
  features: string[];
  is_active: boolean;
}

interface UserSubscription {
  id: string;
  plan_id: string;
  status: string;
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  payment_status: string;
}

interface UsageStats {
  cv_views_used: number;
  job_postings_used: number;
  cv_views_limit: number;
  job_postings_limit: number;
}

const RecruiterSubscriptionPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [selectionHistory, setSelectionHistory] = useState<{ planId: string; planName: string; timestamp: string }[]>([]);
  const { toast } = useToast();
  const HISTORY_STORAGE_KEY = 'novrh-plan-history';

  useEffect(() => {
    loadData();
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (stored) {
          setSelectionHistory(JSON.parse(stored));
        }
      } catch (error) {
        console.warn('Impossible de charger l\'historique des plans:', error);
      }
    }
  }, []);

  const persistSelectionHistory = (entry: { planId: string; planName: string; timestamp: string }) => {
    setSelectionHistory((prev) => {
      const updated = [entry, ...prev.filter((item) => item.planId !== entry.planId)].slice(0, 5);
      if (typeof window !== 'undefined') {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const recordPlanIntent = async (planId: string, planName: string, userId?: string) => {
    const entry = {
      planId,
      planName,
      timestamp: new Date().toISOString()
    };
    persistSelectionHistory(entry);

    try {
      await supabase.from('recruiter_subscription_events').insert({
        plan_id: planId,
        plan_name: planName,
        user_id: userId || null,
        event_type: 'selected',
        metadata: {
          source: 'recruiter_subscription_page'
        }
      });
    } catch (error) {
      console.warn('Impossible d\'enregistrer l\'interaction plan:', error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Charger les plans d'abonnement
      const { data: plansData, error: plansError } = await supabase
        .from('recruiter_subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (plansError) throw plansError;

      // Charger l'abonnement de l'utilisateur
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('recruiter_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .gte('end_date', new Date().toISOString())
          .order('created_at', { ascending: false })
          .limit(1);

        if (subscriptionError) throw subscriptionError;

        // Charger les statistiques d'utilisation
        if (subscriptionData && subscriptionData.length > 0) {
          const subscription = subscriptionData[0];
          const { data: usageData, error: usageError } = await supabase
            .from('recruiter_usage_tracking')
            .select('*')
            .eq('user_id', user.id)
            .eq('subscription_id', subscription.id);

          if (usageError) throw usageError;

          const cvViewsUsed = usageData?.find(u => u.feature_type === 'cv_view')?.usage_count || 0;
          const jobPostingsUsed = usageData?.find(u => u.feature_type === 'job_posting')?.usage_count || 0;
          
          const plan = plansData?.find(p => p.id === subscription.plan_id);
          setUsageStats({
            cv_views_used: cvViewsUsed,
            job_postings_used: jobPostingsUsed,
            cv_views_limit: plan?.max_cv_views || 0,
            job_postings_limit: plan?.max_job_postings || 0
          });
        }

        setUserSubscription(subscriptionData?.[0] || null);
      }

      setPlans(plansData || []);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      toast({
        title: "Erreur",
        description: "Impossible de charger les informations d'abonnement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const subscribeToPlan = async (planId: string) => {
    try {
      setSubscribing(planId);
      
      const { data: { user } } = await supabase.auth.getUser();

      const plan = plans.find(p => p.id === planId);
      if (!plan) {
        toast({
          title: "Erreur",
          description: "Plan d'abonnement introuvable",
          variant: "destructive",
        });
        return;
      }

      await recordPlanIntent(planId, plan.name, user?.id);

      if (!user) {
        toast({
          title: "Connexion requise",
          description: "Créez un compte recruteur pour finaliser votre abonnement.",
          variant: "destructive",
        });
        return;
      }

      // Calculer la date de fin
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + plan.duration_months);

      // Créer l'abonnement
      const { data, error } = await supabase
        .from('recruiter_subscriptions')
        .insert([
          {
            user_id: user.id,
            plan_id: planId,
            status: 'active',
            start_date: new Date().toISOString(),
            end_date: endDate.toISOString(),
            auto_renew: true,
            payment_status: 'paid' // Simuler un paiement réussi
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Créer les entrées de suivi d'utilisation
      await supabase
        .from('recruiter_usage_tracking')
        .insert([
          {
            user_id: user.id,
            subscription_id: data.id,
            feature_type: 'cv_view',
            usage_count: 0
          },
          {
            user_id: user.id,
            subscription_id: data.id,
            feature_type: 'job_posting',
            usage_count: 0
          }
        ]);

      toast({
        title: "Abonnement activé",
        description: `Votre abonnement ${plan.name} a été activé avec succès !`,
      });

      // Recharger les données
      await loadData();
    } catch (error) {
      console.error('Erreur lors de l\'abonnement:', error);
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      toast({
        title: "Erreur",
        description: message || "Impossible de créer l'abonnement",
        variant: "destructive",
      });
    } finally {
      setSubscribing(null);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' ' + currency;
  };

  const getPlanIcon = (planName: string) => {
    if (planName.includes('Premium')) return <Crown className="w-6 h-6" />;
    if (planName.includes('Standard')) return <Star className="w-6 h-6" />;
    return <Shield className="w-6 h-6" />;
  };

  const getPlanColor = (planName: string) => {
    if (planName.includes('Premium')) return 'border-yellow-500 bg-yellow-50';
    if (planName.includes('Standard')) return 'border-blue-500 bg-blue-50';
    return 'border-gray-500 bg-gray-50';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des plans d'abonnement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Plans d'Abonnement Recruteur
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choisissez le plan qui correspond à vos besoins de recrutement et accédez aux CV des candidats
        </p>
      </div>

      {selectionHistory.length > 0 && (
        <Card className="border-blue-100 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-blue-900">Historique récent des plans consultés</CardTitle>
            <CardDescription>Ces interactions sont enregistrées localement pour faciliter vos comparaisons.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {selectionHistory.map((entry) => (
              <div key={`${entry.planId}-${entry.timestamp}`} className="flex items-center justify-between text-sm">
                <span className="font-medium text-blue-900">
                  {plans.find((p) => p.id === entry.planId)?.name || entry.planName}
                </span>
                <span className="text-blue-800/80">
                  {new Date(entry.timestamp).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Abonnement actuel */}
      {userSubscription && (
        <Card className="border-green-500 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              Abonnement Actif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="font-semibold">
                  {plans.find(p => p.id === userSubscription.plan_id)?.name || 'Inconnu'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expire le</p>
                <p className="font-semibold">
                  {new Date(userSubscription.end_date).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                <Badge className="bg-green-100 text-green-800">
                  {userSubscription.status}
                </Badge>
              </div>
            </div>
            
            {usageStats && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Consultations de CV</p>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" />
                    <span className="font-semibold">
                      {usageStats.cv_views_used} / {usageStats.cv_views_limit === -1 ? '∞' : usageStats.cv_views_limit}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Publications d'offres</p>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <span className="font-semibold">
                      {usageStats.job_postings_used} / {usageStats.job_postings_limit === -1 ? '∞' : usageStats.job_postings_limit}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Plans d'abonnement */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = userSubscription?.plan_id === plan.id;
          const isSubscribing = subscribing === plan.id;
          
          return (
            <Card 
              key={plan.id} 
              className={`relative ${getPlanColor(plan.name)} ${
                plan.name.includes('Premium') ? 'scale-105 shadow-lg' : ''
              }`}
            >
              {plan.name.includes('Premium') && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-yellow-500 text-white px-3 py-1">
                    <Crown className="w-3 h-3 mr-1" />
                    Populaire
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  {getPlanIcon(plan.name)}
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-primary">
                  {formatPrice(plan.price, plan.currency)}
                </div>
                <p className="text-sm text-muted-foreground">
                  par {plan.duration_months === 12 ? 'an' : 'mois'}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  {plan.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="w-4 h-4 text-primary" />
                    <span>
                      {plan.max_cv_views === -1 ? 'Accès illimité aux CV' : `${plan.max_cv_views} consultations de CV`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <span>
                      {plan.max_job_postings === -1 ? 'Publications illimitées' : `${plan.max_job_postings} publications d'offres`}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4">
                  {isCurrentPlan ? (
                    <Button disabled className="w-full">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Plan Actuel
                    </Button>
                  ) : (
                    <Button
                      onClick={() => subscribeToPlan(plan.id)}
                      disabled={isSubscribing}
                      className="w-full"
                      variant={plan.name.includes('Premium') ? 'default' : 'outline'}
                    >
                      {isSubscribing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Abonnement...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          S'abonner
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Informations supplémentaires */}
      <Card>
        <CardHeader>
          <CardTitle>Pourquoi s'abonner ?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Accès aux CV</h3>
              <p className="text-sm text-muted-foreground">
                Consultez les CV des candidats qualifiés et trouvez les profils qui correspondent à vos besoins
              </p>
            </div>
            <div className="text-center">
              <Briefcase className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Publier des Offres</h3>
              <p className="text-sm text-muted-foreground">
                Diffusez vos offres d'emploi et attirez les meilleurs candidats
              </p>
            </div>
            <div className="text-center">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Support Prioritaire</h3>
              <p className="text-sm text-muted-foreground">
                Bénéficiez d'un support client dédié pour optimiser vos recrutements
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruiterSubscriptionPlans;
