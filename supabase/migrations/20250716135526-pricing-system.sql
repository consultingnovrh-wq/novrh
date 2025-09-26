-- Create pricing plans table
CREATE TABLE public.pricing_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly', 'one_time')),
  features JSONB NOT NULL DEFAULT '[]',
  category TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.pricing_plans(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create usage tracking table
CREATE TABLE public.feature_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  usage_count INTEGER NOT NULL DEFAULT 0,
  limit_count INTEGER,
  reset_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default pricing plans
INSERT INTO public.pricing_plans (name, description, price, currency, billing_cycle, features, category) VALUES
-- Services étudiants internationaux
('Coaching CV International', 'Coaching CV pour étudiants internationaux', 15.00, 'EUR', 'one_time', '["cv_coaching", "cv_review", "cv_optimization"], 'student_international'),
('Lettre Motivation International', 'Lettre de motivation pour étudiants internationaux', 15.00, 'EUR', 'one_time', '["motivation_letter", "letter_review", "letter_optimization"], 'student_international'),
('Pack CV + Lettre International', 'Pack complet CV + Lettre de motivation pour étudiants internationaux', 20.00, 'EUR', 'one_time', '["cv_coaching", "cv_review", "cv_optimization", "motivation_letter", "letter_review", "letter_optimization"], 'student_international'),

-- Services étudiants maliens
('Coaching CV Mali', 'Coaching CV pour étudiants maliens', 5000.00, 'FCFA', 'one_time', '["cv_coaching", "cv_review", "cv_optimization"], 'student_mali'),
('Lettre Motivation Mali', 'Lettre de motivation pour étudiants maliens', 5000.00, 'FCFA', 'one_time', '["motivation_letter", "letter_review", "letter_optimization"], 'student_mali'),
('Pack CV + Lettre Mali', 'Pack complet CV + Lettre de motivation pour étudiants maliens', 7500.00, 'FCFA', 'one_time', '["cv_coaching", "cv_review", "cv_optimization", "motivation_letter", "letter_review", "letter_optimization"], 'student_mali'),

-- Abonnements entreprises - Recrutement complet
('Recrutement Complet 0-100', 'Recrutement complet pour entreprises de 0 à 100 salariés', 150000.00, 'FCFA', 'monthly', '["recruitment_complete", "job_posting", "cv_access", "candidate_screening", "interview_coordination", "integration_support"], 'business_complete'),
('Recrutement Complet 0-500', 'Recrutement complet pour entreprises de 0 à 500 salariés', 200000.00, 'FCFA', 'monthly', '["recruitment_complete", "job_posting", "cv_access", "candidate_screening", "interview_coordination", "integration_support"], 'business_complete'),
('Recrutement Complet 500+', 'Recrutement complet pour entreprises de 500+ salariés', 300000.00, 'FCFA', 'monthly', '["recruitment_complete", "job_posting", "cv_access", "candidate_screening", "interview_coordination", "integration_support"], 'business_complete'),

-- Abonnements entreprises - Recrutement partiel
('Recrutement Partiel 0-100', 'Recrutement partiel pour entreprises de 0 à 100 salariés', 70000.00, 'FCFA', 'monthly', '["recruitment_partial", "job_posting", "cv_access", "candidate_screening"], 'business_partial'),
('Recrutement Partiel 0-500', 'Recrutement partiel pour entreprises de 0 à 500 salariés', 100000.00, 'FCFA', 'monthly', '["recruitment_partial", "job_posting", "cv_access", "candidate_screening"], 'business_partial'),
('Recrutement Partiel 500+', 'Recrutement partiel pour entreprises de 500+ salariés', 150000.00, 'FCFA', 'monthly', '["recruitment_partial", "job_posting", "cv_access", "candidate_screening"], 'business_partial'),

-- Abonnements entreprises - Recrutement en autonomie
('Recrutement Autonomie', 'Recrutement en autonomie avec accompagnement léger', 45000.00, 'FCFA', 'monthly', '["recruitment_autonomy", "job_posting", "cv_access", "light_support"], 'business_autonomy'),

-- Services établissements scolaires
('Séance CV Classe', 'Séance sur CV & Lettre de motivation par classe', 100000.00, 'FCFA', 'one_time', '["cv_session", "motivation_letter_session", "class_training"], 'education');

-- Enable Row Level Security
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_usage ENABLE ROW LEVEL SECURITY;

-- Create policies for pricing_plans (public read access)
CREATE POLICY "Anyone can view pricing plans" ON public.pricing_plans
  FOR SELECT USING (true);

-- Create policies for user_subscriptions
CREATE POLICY "Users can view their own subscriptions" ON public.user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON public.user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON public.user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for feature_usage
CREATE POLICY "Users can view their own feature usage" ON public.feature_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feature usage" ON public.feature_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feature usage" ON public.feature_usage
  FOR UPDATE USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_pricing_plans_updated_at
  BEFORE UPDATE ON public.pricing_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feature_usage_updated_at
  BEFORE UPDATE ON public.feature_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX idx_feature_usage_user_id ON public.feature_usage(user_id);
CREATE INDEX idx_feature_usage_feature_name ON public.feature_usage(feature_name);
