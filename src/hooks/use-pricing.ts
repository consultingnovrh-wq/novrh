import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PricingPlan, UserSubscription, FeatureUsage } from '@/types/pricing';

export const usePricing = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { plans, loading, error, refetch: fetchPlans };
};

export const useUserSubscription = (userId?: string) => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchSubscription(userId);
    }
  }, [userId]);

  const fetchSubscription = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          pricing_plans (*)
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setSubscription(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createSubscription = async (planId: string, userId: string) => {
    try {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert([
          {
            user_id: userId,
            plan_id: planId,
            status: 'pending',
            end_date: endDate.toISOString(),
            payment_status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err: any) {
      throw err;
    }
  };

  return {
    subscription,
    loading,
    error,
    createSubscription,
    refetch: () => userId ? fetchSubscription(userId) : null
  };
};

export const useFeatureAccess = (userId?: string, featureName?: string) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [usage, setUsage] = useState<FeatureUsage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId && featureName) {
      checkFeatureAccess(userId, featureName);
    }
  }, [userId, featureName]);

  const checkFeatureAccess = async (userId: string, featureName: string) => {
    try {
      setLoading(true);
      
      // Get user subscription
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          pricing_plans (features)
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (!subscription) {
        setHasAccess(false);
        return;
      }

      // Check if feature is included in plan
      const planFeatures = subscription.pricing_plans?.features || [];
      if (!planFeatures.includes(featureName)) {
        setHasAccess(false);
        return;
      }

      // Get usage data
      const { data: usageData } = await supabase
        .from('feature_usage')
        .select('*')
        .eq('user_id', userId)
        .eq('feature_name', featureName)
        .single();

      setUsage(usageData);
      
      // Check if usage is within limits
      if (usageData && usageData.limit_count) {
        setHasAccess(usageData.usage_count < usageData.limit_count);
      } else {
        setHasAccess(true);
      }
    } catch (err) {
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  const incrementUsage = async (userId: string, featureName: string) => {
    try {
      if (!usage) {
        // Create new usage record
        const { data, error } = await supabase
          .from('feature_usage')
          .insert([
            {
              user_id: userId,
              feature_name: featureName,
              usage_count: 1,
              reset_date: new Date().toISOString().split('T')[0]
            }
          ])
          .select()
          .single();

        if (error) throw error;
        setUsage(data);
      } else {
        // Update existing usage
        const { data, error } = await supabase
          .from('feature_usage')
          .update({ usage_count: usage.usage_count + 1 })
          .eq('id', usage.id)
          .select()
          .single();

        if (error) throw error;
        setUsage(data);
      }
    } catch (err) {
      console.error('Error incrementing usage:', err);
    }
  };

  return {
    hasAccess,
    usage,
    loading,
    incrementUsage
  };
};
