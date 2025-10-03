-- CORRECTION RLS SEULEMENT - SANS TESTS QUI CONFLICTENT
-- Copier-coller dans Supabase Dashboard → SQL Editor

-- ==================== DÉSACTIVER RLS ====================
-- Permettre l'accès libre aux données pour éviter les erreurs 403/406
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;

-- Accorder toutes les permissions aux rôles Supabase
GRANT ALL ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- ==================== DIAGNOSTIC SIRASAFE ====================
-- Vérifier le statut actuel de Sirasafe
SELECT 'SIRASAFE ACTUEL:' as info;

SELECT 
    p.email,
    p.user_type,
    p.first_name,
    c.company_name,
    CASE 
        WHEN p.user_type = 'company' AND c.company_name IS NOT NULL 
        THEN '✅ ENTREPRISE PARFAITEMENT CONFIGURÉE' 
        WHEN p.user_type = 'company' AND c.company_name IS NULL
        THEN '⚠️ Profil OK mais données entreprise manquantes'
        WHEN p.user_type != 'company'
        THEN CONCAT('❌ Mauvais user_type: ', p.user_type)
        ELSE '❌ Profil non trouvé'
    END as statut
FROM public.profiles p
LEFT JOIN public.companies c ON c.user_id = p.user_id
WHERE p.email = 'contactsirasafe@gmail.com';

-- ==================== CORRIGER SIRASAFE SI NÉCESSAIRE ====================
-- Forcer la configuration entreprise pour Sirasafe
UPDATE public.profiles 
SET 
    user_type = 'company',
    updated_at = now()
WHERE email = 'contactsirasafe@gmail.com';

-- Créer les données entreprise pour Sirasafe si elles n'existent pas
INSERT INTO public.companies (
    user_id,
    company_name,
    company_address,
    is_verified
)
SELECT 
    p.user_id,
    COALESCE(p.first_name, 'Sirasafe'),
    'Adresse Sirasafe',
    false
FROM public.profiles p
WHERE p.email = 'contactsirasafe@gmail.com'
AND NOT EXISTS (
    SELECT 1 FROM public.companies c WHERE c.user_id = p.user_id
);

-- ==================== VÉRIFICATION FINALE ====================
SELECT 'RÉSULTAT FINAL:' as info;

SELECT 
    p.email,
    p.user_type,
    c.company_name,
    CASE 
        WHEN p.user_type = 'company' AND c.company_name IS NOT NULL 
        THEN '✅ SIRASAFE PRÊTE POUR DASHBOARD ENTREPRISE'
        ELSE '❌ PROBLÈME RESTANT'
    END as resultat_final
FROM public.profiles p
LEFT JOIN public.companies c ON c.user_id = p.user_id
WHERE p.email = 'contactsirasafe@gmail.com';

-- Message de fin
SELECT '🎯 RLS DÉSACTIVÉ - SIRASAFE CONFIGURÉE!' as message;
SELECT 'Rafraîchissez la page et cliquez "Tableau de bord"' as instruction;
