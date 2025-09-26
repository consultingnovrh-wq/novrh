-- Migration pour créer le système de souscription et de paiement
-- Création des tables et des fonctions de base

-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'XOF',
  duration_days INTEGER NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID NOT NULL REFERENCES public.user_subscriptions(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'XOF',
  payment_method TEXT NOT NULL,
  transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create service access table
CREATE TABLE public.service_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL UNIQUE,
  service_description TEXT,
  requires_subscription BOOLEAN NOT NULL DEFAULT true,
  required_plan_types TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX idx_user_subscriptions_end_date ON public.user_subscriptions(end_date);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_subscription_id ON public.payments(subscription_id);
CREATE INDEX idx_service_access_service_name ON public.service_access(service_name);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, description, price, currency, duration_days, features) VALUES
('Gratuit', 'Plan gratuit avec fonctionnalités de base', 0.00, 'XOF', 365, '["inscription", "connexion", "profil_de_base", "recherche_basique"]'),
('Basique', 'Plan basique pour les particuliers', 5000.00, 'XOF', 365, '["inscription", "connexion", "profil_de_base", "recherche_basique", "poster_offre", "acces_cv_limite"]'),
('Premium', 'Plan premium pour les professionnels', 25000.00, 'XOF', 365, '["inscription", "connexion", "profil_de_base", "recherche_basique", "poster_offre", "acces_cv_illimite", "recherche_avancee", "support_prioritaire"]'),
('Entreprise', 'Solution complète pour les entreprises', 100000.00, 'XOF', 365, '["inscription", "connexion", "profil_de_base", "recherche_basique", "poster_offre", "acces_cv_illimite", "recherche_avancee", "support_prioritaire", "analytics", "fonctionnalites_personnalisees"]');

-- Insert default service access rules
INSERT INTO public.service_access (service_name, service_description, requires_subscription, required_plan_types) VALUES
('Inscription', 'Création de compte utilisateur', false, '{}'),
('Connexion', 'Accès au système', false, '{}'),
('Profil de base', 'Visualisation et modification du profil', false, '{}'),
('Recherche d''emploi', 'Recherche basique d''offres d''emploi', false, '{}'),
('Poster une offre', 'Publication d''offres d''emploi', true, ARRAY['Basique', 'Premium', 'Entreprise']),
('Accès CV', 'Consultation des CV des candidats', true, ARRAY['Basique', 'Premium', 'Entreprise']),
('Recherche avancée', 'Recherche avec filtres avancés', true, ARRAY['Premium', 'Entreprise']),
('Support prioritaire', 'Support client prioritaire', true, ARRAY['Premium', 'Entreprise']),
('Analytics', 'Statistiques et analyses', true, ARRAY['Premium', 'Entreprise']),
('Fonctionnalités personnalisées', 'Fonctionnalités sur mesure', true, ARRAY['Entreprise']);

-- Enable Row Level Security
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_access ENABLE ROW LEVEL SECURITY;

-- Create policies for subscription_plans (public read access)
CREATE POLICY "Anyone can view active subscription plans"
  ON public.subscription_plans FOR SELECT
  USING (is_active = true);

-- Create policies for user_subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON public.user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
  ON public.user_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON public.user_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policies for payments
CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for service_access (public read access)
CREATE POLICY "Anyone can view service access rules"
  ON public.service_access FOR SELECT
  USING (is_active = true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_access_updated_at
  BEFORE UPDATE ON public.service_access
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to check service access
CREATE OR REPLACE FUNCTION public.check_service_access(
  service_name TEXT,
  user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN AS $$
DECLARE
  service_record RECORD;
  user_subscription RECORD;
BEGIN
  -- Get service information
  SELECT * INTO service_record
  FROM public.service_access
  WHERE service_name = $1 AND is_active = true;
  
  -- If service doesn't exist or doesn't require subscription, allow access
  IF NOT FOUND OR NOT service_record.requires_subscription THEN
    RETURN true;
  END IF;
  
  -- If user is not authenticated, deny access
  IF user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if user has active subscription
  SELECT us.*, sp.name as plan_name
  INTO user_subscription
  FROM public.user_subscriptions us
  JOIN public.subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = $2
    AND us.status = 'active'
    AND us.end_date > now()
  ORDER BY us.created_at DESC
  LIMIT 1;
  
  -- If no active subscription, deny access
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Check if user's plan type is in required plan types
  RETURN user_subscription.plan_name = ANY(service_record.required_plan_types);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.subscription_plans TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_subscriptions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.payments TO authenticated;
GRANT SELECT ON public.service_access TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_service_access TO anon, authenticated;
