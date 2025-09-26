-- Script de création de la base de données pour NovRH
-- Nouveau compte Supabase: dsxkfzqqgghwqiihierm

-- 1. Créer les types personnalisés
CREATE TYPE user_type AS ENUM ('candidate', 'company', 'admin', 'student');
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'cancelled', 'expired');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE admin_role_type AS ENUM ('super_admin', 'admin', 'moderator', 'support');

-- 2. Créer la table profiles
CREATE TABLE public.profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    user_type user_type DEFAULT 'candidate' NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    email_verified BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_sign_in_at TIMESTAMP WITH TIME ZONE
);

-- 3. Créer la table companies
CREATE TABLE public.companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE UNIQUE NOT NULL,
    company_name TEXT NOT NULL,
    company_address TEXT,
    nif_matricule TEXT UNIQUE,
    is_verified BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Créer la table candidates
CREATE TABLE public.candidates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    profile_description TEXT,
    cv_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Créer la table jobs
CREATE TABLE public.jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    location TEXT NOT NULL,
    job_type TEXT NOT NULL,
    experience_level TEXT,
    education_level TEXT,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    deadline DATE,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Créer la table opportunities
CREATE TABLE public.opportunities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    location TEXT NOT NULL,
    opportunity_type TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    deadline DATE,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Créer la table classifieds
CREATE TABLE public.classifieds (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    price DECIMAL(10,2),
    location TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Créer la table tenders
CREATE TABLE public.tenders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    budget DECIMAL(15,2),
    location TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    deadline DATE,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Créer la table subscription_plans
CREATE TABLE public.subscription_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'FCFA' NOT NULL,
    duration_days INTEGER NOT NULL,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Créer la table user_subscriptions
CREATE TABLE public.user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
    plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE CASCADE NOT NULL,
    status subscription_status DEFAULT 'active' NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Créer la table payments
CREATE TABLE public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'FCFA' NOT NULL,
    status payment_status DEFAULT 'pending' NOT NULL,
    payment_method TEXT NOT NULL,
    transaction_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Créer la table admin_roles
CREATE TABLE public.admin_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. Créer la table administrators
CREATE TABLE public.administrators (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE UNIQUE NOT NULL,
    role_id UUID REFERENCES public.admin_roles(id) ON DELETE CASCADE NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. Créer la table admin_invitations
CREATE TABLE public.admin_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role_id UUID REFERENCES public.admin_roles(id) ON DELETE CASCADE NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending' NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. Créer la table admin_logs
CREATE TABLE public.admin_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES public.administrators(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id UUID,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 16. Créer la table site_settings
CREATE TABLE public.site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 17. Créer les fonctions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, first_name, last_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'last_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_updated_user()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET 
        email = NEW.email,
        updated_at = timezone('utc'::text, now())
    WHERE user_id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 18. Créer les triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_user();

-- 19. Activer RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classifieds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.administrators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 20. Créer les politiques RLS
-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Companies
CREATE POLICY "Users can view all companies" ON public.companies
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own company" ON public.companies
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own company" ON public.companies
    FOR UPDATE USING (auth.uid() = user_id);

-- Candidates
CREATE POLICY "Users can view all candidates" ON public.candidates
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own candidate profile" ON public.candidates
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own candidate profile" ON public.candidates
    FOR UPDATE USING (auth.uid() = user_id);

-- Jobs
CREATE POLICY "Users can view all jobs" ON public.jobs
    FOR SELECT USING (true);

CREATE POLICY "Users can insert jobs" ON public.jobs
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own jobs" ON public.jobs
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Opportunities
CREATE POLICY "Users can view all opportunities" ON public.opportunities
    FOR SELECT USING (true);

CREATE POLICY "Users can insert opportunities" ON public.opportunities
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Classifieds
CREATE POLICY "Users can view all classifieds" ON public.classifieds
    FOR SELECT USING (true);

CREATE POLICY "Users can insert classifieds" ON public.classifieds
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Tenders
CREATE POLICY "Users can view all tenders" ON public.tenders
    FOR SELECT USING (true);

CREATE POLICY "Users can insert tenders" ON public.tenders
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Subscription plans
CREATE POLICY "Users can view subscription plans" ON public.subscription_plans
    FOR SELECT USING (true);

-- User subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON public.user_subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Payments
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments" ON public.payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin tables (restricted to admins)
CREATE POLICY "Only admins can view admin roles" ON public.admin_roles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.administrators 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Only admins can view administrators" ON public.administrators
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.administrators 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Only admins can view admin logs" ON public.admin_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.administrators 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

-- 21. Insérer les données initiales
-- Plans d'abonnement
INSERT INTO public.subscription_plans (name, description, price, duration_days, features) VALUES
('Gratuit', 'Plan gratuit avec fonctionnalités de base', 0, 30, '["1 offre d''emploi", "Profil candidat", "Recherche d''emploi"]'),
('Premium', 'Plan premium avec fonctionnalités avancées', 5000, 30, '["10 offres d''emploi", "Profil candidat premium", "Recherche avancée", "Notifications"]'),
('Entreprise', 'Plan entreprise pour les grandes organisations', 15000, 30, '["Offres illimitées", "Gestion d''équipe", "Statistiques avancées", "Support prioritaire"]');

-- Rôles admin
INSERT INTO public.admin_roles (name, display_name, description, permissions) VALUES
('super_admin', 'Super Administrateur', 'Accès complet au système', '{"users": true, "companies": true, "jobs": true, "candidates": true, "settings": true, "reports": true, "roles": true, "payments": true}'),
('admin', 'Administrateur', 'Gestion des utilisateurs et contenu', '{"users": true, "companies": true, "jobs": true, "candidates": true, "reports": true, "payments": true}'),
('moderator', 'Modérateur', 'Modération du contenu', '{"users": true, "jobs": true, "candidates": true}'),
('support', 'Support', 'Support client', '{"users": true, "reports": true}');

-- Paramètres du site
INSERT INTO public.site_settings (key, value, description) VALUES
('site_name', '"NovRH Consulting"', 'Nom du site'),
('site_description', '"Plateforme de recrutement et services RH"', 'Description du site'),
('contact_email', '"contact@novrh.com"', 'Email de contact'),
('max_jobs_per_user', '10', 'Nombre maximum d''offres par utilisateur');

-- Message de confirmation
SELECT 'Base de données créée avec succès pour NovRH' as message;
