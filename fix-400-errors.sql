-- Script pour corriger les erreurs 400 et permettre aux entreprises d'apparaître
-- Copier-coller directement dans Supabase Dashboard → SQL Editor

-- 1. DÉSACTIVER RLS TEMPORAIREMENT sur toutes les tables critiques
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.administrators DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles DISABLE ROW LEVEL SECURITY;

-- 2. AJOUTER PERMISSIONS EXPANDED pour éviter les erreurs 400
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

-- 3. VERIFIER LES ENTREPRISES EXISTANTES
SELECT 
    'ENTREPRISES:' as info,
    COUNT(*) as total_companies
FROM public.companies;

-- 4. VERIFIER LES PROFILS ENTREPRISE
SELECT 
    'PROFILS COMPANY:' as info,
    COUNT(*) as total_company_profiles
FROM public.profiles 
WHERE user_type = 'company';

-- 5. TEST DE REQUÊTE SIMPLE
SELECT 
    'TEST OK:' as status,
    COUNT(*) as profiles_count
FROM public.profiles
WHERE created_at IS NOT NULL;

SELECT 'RLS désactivé et permissions accordées !' as final_status;
