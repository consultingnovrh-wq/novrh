-- Script de configuration de la base de données NovRH
-- À exécuter dans la console Supabase (SQL Editor)

-- 1. Créer la table profiles manquante
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL CHECK (user_type IN ('candidate', 'employer', 'student', 'company')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Créer la table candidates si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  profile_description TEXT,
  cv_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Créer la table companies si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_address TEXT,
  nif_matricule TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Créer la table jobs si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  salary_min DECIMAL(10,2),
  salary_max DECIMAL(10,2),
  location TEXT,
  job_type TEXT CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Créer la table job_applications si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cv_url TEXT,
  cover_letter TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Activer RLS sur toutes les nouvelles tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- 7. Créer les politiques RLS pour profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- 8. Créer les politiques RLS pour candidates
CREATE POLICY "Candidates can view their own profile"
  ON public.candidates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Candidates can insert their own profile"
  ON public.candidates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Candidates can update their own profile"
  ON public.candidates FOR UPDATE
  USING (auth.uid() = user_id);

-- 9. Créer les politiques RLS pour companies
CREATE POLICY "Companies can view their own profile"
  ON public.companies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Companies can insert their own profile"
  ON public.companies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Companies can update their own profile"
  ON public.companies FOR UPDATE
  USING (auth.uid() = user_id);

-- 10. Créer les politiques RLS pour jobs
CREATE POLICY "Anyone can view active jobs"
  ON public.jobs FOR SELECT
  USING (is_active = true);

CREATE POLICY "Employers can create jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (auth.uid() = employer_id);

CREATE POLICY "Employers can update their own jobs"
  ON public.jobs FOR UPDATE
  USING (auth.uid() = employer_id);

-- 11. Créer les politiques RLS pour job_applications
CREATE POLICY "Candidates can view their own applications"
  ON public.job_applications FOR SELECT
  USING (auth.uid() = candidate_id);

CREATE POLICY "Employers can view applications for their jobs"
  ON public.job_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs 
      WHERE jobs.id = job_applications.job_id 
      AND jobs.employer_id = auth.uid()
    )
  );

CREATE POLICY "Candidates can create applications"
  ON public.job_applications FOR INSERT
  WITH CHECK (auth.uid() = candidate_id);

CREATE POLICY "Employers can update application status"
  ON public.job_applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs 
      WHERE jobs.id = job_applications.job_id 
      AND jobs.employer_id = auth.uid()
    )
  );

-- 12. Créer les index pour les performances
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_candidates_user_id ON public.candidates(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON public.companies(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON public.jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON public.jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_candidate_id ON public.job_applications(candidate_id);

-- 13. Corriger la fonction check_service_access
CREATE OR REPLACE FUNCTION public.check_service_access(
  service_name text,
  user_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_subscription_record record;
  service_record record;
  user_profile_record record;
BEGIN
  -- Si pas d'utilisateur connecté, refuser l'accès
  IF user_id IS NULL THEN
    RETURN false;
  END IF;

  -- Récupérer le profil de l'utilisateur
  SELECT user_type INTO user_profile_record.user_type
  FROM public.profiles
  WHERE profiles.user_id = check_service_access.user_id;

  -- Si pas de profil, refuser l'accès
  IF user_profile_record.user_type IS NULL THEN
    RETURN false;
  END IF;

  -- Récupérer les informations du service
  SELECT * INTO service_record
  FROM public.service_access
  WHERE service_name = check_service_access.service_name
    AND is_active = true;

  -- Si le service n'existe pas, refuser l'accès
  IF service_record IS NULL THEN
    RETURN false;
  END IF;

  -- Si le service ne nécessite pas d'abonnement, autoriser l'accès
  IF NOT service_record.requires_subscription THEN
    RETURN true;
  END IF;

  -- Récupérer l'abonnement actif de l'utilisateur
  SELECT us.*, sp.features, sp.currency
  INTO user_subscription_record
  FROM public.user_subscriptions us
  JOIN public.subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = check_service_access.user_id
    AND us.status = 'active'
    AND us.end_date > now()
  ORDER BY us.created_at DESC
  LIMIT 1;

  -- Si pas d'abonnement actif, refuser l'accès
  IF user_subscription_record IS NULL THEN
    RETURN false;
  END IF;

  -- Vérifier si l'abonnement correspond aux types requis
  -- Logique simplifiée basée sur le nom du plan
  IF user_subscription_record.features::text LIKE '%Étudiant%' THEN
    RETURN 'student_coaching' = ANY(service_record.required_plan_types);
  ELSIF user_subscription_record.features::text LIKE '%Recrutement Complet%' THEN
    RETURN 'recruitment_complete' = ANY(service_record.required_plan_types);
  ELSIF user_subscription_record.features::text LIKE '%Recrutement Partiel%' THEN
    RETURN 'recruitment_partial' = ANY(service_record.required_plan_types);
  ELSIF user_subscription_record.features::text LIKE '%Recrutement Autonomie%' THEN
    RETURN 'recruitment_autonomy' = ANY(service_record.required_plan_types);
  END IF;

  RETURN false;
END;
$$;

-- 14. Créer un trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON public.candidates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON public.job_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 15. Créer le bucket de stockage pour les CVs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cvs', 'cvs', false)
ON CONFLICT (id) DO NOTHING;

-- 16. Politique de stockage pour les CVs
CREATE POLICY "Users can upload their own CVs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own CVs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Message de confirmation
SELECT 'Base de données configurée avec succès !' as status;
