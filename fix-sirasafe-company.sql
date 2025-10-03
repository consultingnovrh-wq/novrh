-- Script pour corriger le type d'utilisateur de sirasafe
-- Copier-coller dans Supabase Dashboard → SQL Editor

-- 1. Vérifier l'utilisateur sirasafe
SELECT 'VÉRIFICATION UTILISATEUR SIRASAFE:' as info;

SELECT 
    p.user_id,
    p.email,
    p.user_type,
    p.first_name,
    p.last_name,
    p.is_active,
    p.created_at
FROM public.profiles p
WHERE p.email = 'contactsirasafe@gmail.com';

-- 2. Corriger le type d'utilisateur pour sirasafe
UPDATE public.profiles 
SET 
    user_type = 'company',
    updated_at = now()
WHERE email = 'contactsirasafe@gmail.com';

-- 3. S'assurer qu'il y a une entrée dans companies
INSERT INTO public.companies (
    user_id,
    company_name,
    company_address,
    is_verified,
    created_at
)
SELECT 
    p.user_id,
    COALESCE(p.first_name, 'Sirasafe'),
    'Adresse entreprise',
    false,
    now()
FROM public.profiles p
WHERE p.email = 'contactsirasafe@gmail.com'
AND NOT EXISTS (
    SELECT 1 FROM public.companies c WHERE c.user_id = p.user_id
);

-- 4. Vérification finale
SELECT 'ACTUALISATION EFFECTUÉE:' as info;

SELECT 
    'Profiles:' as table_name,
    p.email,
    p.user_type,
    p.is_active
FROM public.profiles p
WHERE p.email = 'contactsirasafe@gmail.com'

UNION ALL

SELECT 
    'Companies:' as table_name,
    'contactsirasafe@gmail.com',
    c.company_name,
    c.is_verified
FROM public.companies c
JOIN public.profiles p ON c.user_id = p.user_id
WHERE p.email = 'contactsirasafe@gmail.com';

-- 5. Confirmation
SELECT '✅ Sirasafe maintenant configuré comme ENTREPRISE!' as result;
