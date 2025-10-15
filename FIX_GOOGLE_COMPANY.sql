-- CONFIGURER google@gmail.com COMME ENTREPRISE
-- Copier-coller dans Supabase Dashboard → SQL Editor

-- ==================== CONFIGURER GOOGLE@GMAIL.COM COMME ENTREPRISE ====================

-- Forcer user_type = company pour google@gmail.com
UPDATE public.profiles 
SET 
    user_type = 'company',
    updated_at = now()
WHERE email = 'google@gmail.com';

-- Créer/update données entreprise pour google@gmail.com
INSERT INTO public.companies (
    user_id,
    company_name,
    company_address,
    nif_matricule,
    is_verified,
    created_at,
    updated_at
)
SELECT 
    p.user_id,
    'Google Test Entreprise',
    'Adresse Google Test',
    'NIF_GOOGLE_TEST',
    false,
    now(),
    now()
FROM public.profiles p
WHERE p.email = 'google@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
    company_name = EXCLUDED.company_name,
    nif_matricule = EXCLUDED.nif_matricule,
    updated_at = now();

-- ==================== VÉRIFICATION ====================
SELECT '✅ google@gmail.com configuré comme entreprise!' as result;

SELECT 
    p.email,
    p.user_type,
    c.company_name,
    '✅ PRÊT POUR /dashboard/company' as statut
FROM public.profiles p
JOIN public.companies c ON c.user_id = p.user_id
WHERE p.email = 'google@gmail.com';

SELECT '🧪 TEST: Rafraîchir la page et cliquer "Mon Compte" → "Tableau de bord"' as instruction;
