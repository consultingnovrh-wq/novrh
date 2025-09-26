import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import type { Database } from '@/integrations/supabase/types';

type SubscriptionPlan = Database['public']['Tables']['subscription_plans']['Row'];
type UserSubscription = Database['public']['Tables']['user_subscriptions']['Row'];
type Payment = Database['public']['Tables']['payments']['Row'];

export const useSubscription = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Récupérer tous les plans d'abonnement
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des plans:', err);
      setError('Impossible de charger les plans d\'abonnement');
    } finally {
      setLoading(false);
    }
  };

  // Récupérer l'abonnement de l'utilisateur connecté
  const fetchUserSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setUserSubscription(null);
        return;
      }

      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gte('end_date', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      setUserSubscription(data?.[0] || null);
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'abonnement:', err);
    }
  };

  // Vérifier l'accès à un service
  const checkServiceAccess = async (serviceName: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase.rpc('check_service_access', {
        service_name: serviceName,
        user_id: user.id
      });

      if (error) throw error;
      return data || false;
    } catch (err) {
      console.error('Erreur lors de la vérification d\'accès:', err);
      return false;
    }
  };

  // S'abonner à un plan
  const subscribeToPlan = async (planId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour vous abonner",
          variant: "destructive",
        });
        return;
      }

      // Simuler le traitement du paiement
      const paymentResult = await simulatePaymentProcessing(planId, user.id);
      
      if (paymentResult.success) {
        // Créer l'abonnement
        const { error: subscriptionError } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: user.id,
            plan_id: planId,
            status: 'active',
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 an
            payment_status: 'paid'
          });

        if (subscriptionError) throw subscriptionError;

        toast({
          title: "Succès",
          description: "Votre abonnement a été activé avec succès !",
        });

        // Rafraîchir les données
        await fetchUserSubscription();
      }
    } catch (err) {
      console.error('Erreur lors de l\'abonnement:', err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'abonnement",
        variant: "destructive",
      });
    }
  };

  // Simuler le traitement du paiement (à remplacer par un vrai système de paiement)
  const simulatePaymentProcessing = async (planId: string, userId: string): Promise<{ success: boolean }> => {
    try {
      const plan = plans.find(p => p.id === planId);
      if (!plan) throw new Error('Plan non trouvé');

      // Créer un enregistrement de paiement simulé
      const { error } = await supabase
        .from('payments')
        .insert({
          user_id: userId,
          subscription_id: null, // Sera mis à jour après création de l'abonnement
          amount: plan.price,
          currency: plan.currency,
          payment_method: 'simulation',
          transaction_id: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: 'completed',
          payment_data: { method: 'simulation', timestamp: new Date().toISOString() }
        });

      if (error) throw error;

      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 1000));

      return { success: true };
    } catch (err) {
      console.error('Erreur lors de la simulation du paiement:', err);
      return { success: false };
    }
  };

  // Annuler un abonnement
  const cancelSubscription = async () => {
    try {
      if (!userSubscription) return;

      const { error } = await supabase
        .from('user_subscriptions')
        .update({ status: 'cancelled' })
        .eq('id', userSubscription.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre abonnement a été annulé",
      });

      await fetchUserSubscription();
    } catch (err) {
      console.error('Erreur lors de l\'annulation:', err);
      toast({
        title: "Erreur",
        description: "Impossible d'annuler l'abonnement",
        variant: "destructive",
      });
    }
  };

  // Récupérer l'historique des paiements
  const getPaymentHistory = async (): Promise<Payment[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'historique:', err);
      return [];
    }
  };

  // Vérifier si l'utilisateur a un abonnement actif
  const hasActiveSubscription = (): boolean => {
    return userSubscription !== null && 
           userSubscription.status === 'active' && 
           new Date(userSubscription.end_date) > new Date();
  };

  // Obtenir le nom du plan actuel
  const getCurrentPlanName = (): string => {
    if (!userSubscription) return 'Aucun abonnement';
    
    const plan = plans.find(p => p.id === userSubscription.plan_id);
    return plan ? plan.name : 'Plan inconnu';
  };

  // Vérifier si l'utilisateur peut accéder à une fonctionnalité
  const canAccessFeature = (featureName: string): boolean => {
    if (!hasActiveSubscription()) return false;
    
    const plan = plans.find(p => p.id === userSubscription?.plan_id);
    if (!plan) return false;

    // Vérifier que features est un tableau et contient la fonctionnalité
    if (Array.isArray(plan.features)) {
      return plan.features.some(feature => 
        typeof feature === 'string' && feature.toLowerCase().includes(featureName.toLowerCase())
      );
    }
    
    return false;
  };

  // Catégoriser les plans par type
  const getPlansByCategory = () => {
    return {
      student: plans.filter(plan => 
        plan.name.includes('Étudiant') || plan.name.includes('Coaching') || plan.name.includes('Lettre')
      ),
      company: plans.filter(plan => 
        plan.name.includes('Recrutement')
      ),
      educational: plans.filter(plan => 
        plan.name.includes('Établissement') || plan.name.includes('Module')
      )
    };
  };

  // Obtenir les plans selon la période (mensuel/annuel)
  const getPlansByPeriod = (period: 'monthly' | 'yearly') => {
    const durationDays = period === 'monthly' ? 30 : 365;
    return plans.filter(plan => plan.duration_days === durationDays);
  };

  // Obtenir les plans selon la devise
  const getPlansByCurrency = (currency: string) => {
    return plans.filter(plan => plan.currency === currency);
  };

  // Initialisation
  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    fetchUserSubscription();
  }, []);

  return {
    plans,
    userSubscription,
    loading,
    error,
    subscribeToPlan,
    cancelSubscription,
    getPaymentHistory,
    hasActiveSubscription,
    getCurrentPlanName,
    canAccessFeature,
    checkServiceAccess,
    getPlansByCategory,
    getPlansByPeriod,
    getPlansByCurrency,
    refreshData: () => {
      fetchPlans();
      fetchUserSubscription();
    }
  };
};
