-- Script SQL pour créer un compte administrateur
-- À exécuter dans votre base de données Supabase

-- 1. Créer l'utilisateur dans auth.users (via l'API Supabase)
-- Note: Cette étape doit être faite via l'API Supabase ou l'interface d'authentification

-- 2. Insérer le profil administrateur
INSERT INTO public.profiles (
    user_id,
    email,
    first_name,
    last_name,
    user_type,
    is_active,
    email_verified,
    created_at,
    updated_at
) VALUES (
    'USER_ID_FROM_AUTH', -- Remplacez par l'ID de l'utilisateur créé
    'speakaboutai@gmail.com',
    'Admin',
    'NovRH',
    'admin',
    true,
    true,
    NOW(),
    NOW()
);

-- 3. Ajouter l'utilisateur à l'équipe d'administration
INSERT INTO public.team_members (
    team_id,
    user_id,
    role,
    permissions,
    is_active,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440031', -- ID de l'équipe par défaut
    'USER_ID_FROM_AUTH', -- Remplacez par l'ID de l'utilisateur créé
    'owner',
    '{
        "users": ["read", "write", "delete"],
        "companies": ["read", "write", "delete"],
        "jobs": ["read", "write", "delete"],
        "candidates": ["read", "write", "delete"],
        "settings": ["read", "write"],
        "reports": ["read", "write"]
    }',
    true,
    NOW(),
    NOW()
);

-- 4. Logger l'action d'administration
INSERT INTO public.admin_actions (
    user_id,
    action_type,
    target_type,
    target_id,
    details,
    created_at
) VALUES (
    'USER_ID_FROM_AUTH', -- Remplacez par l'ID de l'utilisateur créé
    'user_created',
    'admin_account',
    'USER_ID_FROM_AUTH', -- Remplacez par l'ID de l'utilisateur créé
    '{
        "action": "Création du compte administrateur principal",
        "email": "speakaboutai@gmail.com",
        "role": "super_admin",
        "created_by": "system"
    }',
    NOW()
);

-- 5. Vérifier que le compte a été créé
SELECT 
    p.user_id,
    p.email,
    p.first_name,
    p.last_name,
    p.user_type,
    p.is_active,
    tm.role as team_role,
    tm.permissions
FROM public.profiles p
LEFT JOIN public.team_members tm ON p.user_id = tm.user_id
WHERE p.email = 'speakaboutai@gmail.com';

-- 6. Vérifier les permissions d'administration
SELECT 
    p.user_id,
    p.email,
    p.user_type,
    CASE 
        WHEN p.user_type = 'admin' THEN 'Admin global'
        WHEN tm.role IS NOT NULL THEN 'Membre équipe admin: ' || tm.role
        ELSE 'Aucun accès admin'
    END as admin_status
FROM public.profiles p
LEFT JOIN public.team_members tm ON p.user_id = tm.user_id
WHERE p.email = 'speakaboutai@gmail.com';
