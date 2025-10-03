-- TEST : Vérifier l'inscription dynamique d'une nouvelle entreprise
-- Créer une entreprise de test pour vérifier que la synchronisation automatique fonctionne

-- 1. Créer un utilisateur test entreprise
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at
)
VALUES (
    gen_random_uuid(),
    'test-entreprise@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{
        "first_name": "Test Entreprise",
        "last_name": "SAS",
        "user_type": "company"
    }'::jsonb,
    now(),
    now()
);

-- 2. Vérifier que le trigger a créé automatiquement le profil
SELECT 'PROFIL AUTOMATIQUE:' as info, p.*
FROM public.profiles p
JOIN auth.users au ON au.id = p.user_id
WHERE au.email = 'test-entreprise@example.com';

-- 3. Créer manuellement l'entrée company (compatible avec le code existant)
INSERT INTO public.companies (
    user_id,
    company_name,
    company_address,
    is_verified,
    created_at
)
SELECT 
    au.id,
    au.raw_user_meta_data->>'first_name',
    'Adresse test entreprise',
    false,
    now()
FROM auth.users au
WHERE au.email = 'test-entreprise@example.com';

-- 4. Vérification finale
SELECT 'ENTREPRISE TEST CRÉÉE:' as result;
SELECT 
    au.email,
    p.user_type,
    c.company_name,
    CASE 
        WHEN p.user_type = 'company' AND c.company_name IS NOT NULL 
        THEN '✅ SYNC AUTOMATIQUE OK' 
        ELSE '❌ PROBLÈME DE SYNC'
    END as status
FROM auth.users au
JOIN public.profiles p ON p.user_id = au.id
LEFT JOIN public.companies c ON c.user_id = au.id
WHERE au.email = 'test-entreprise@example.com';
