-- Migration pour désactiver temporairement la vérification email
-- Date: 17 janvier 2025

-- Note: Cette migration désactive la vérification email dans Supabase
-- pour permettre l'inscription sans erreur d'envoi d'email

-- 1. Mettre à jour les utilisateurs existants pour les marquer comme vérifiés
UPDATE auth.users 
SET email_confirmed_at = now()
WHERE email_confirmed_at IS NULL;

-- 2. Mettre à jour la table profiles pour marquer les emails comme vérifiés
UPDATE public.profiles 
SET email_verified = true
WHERE email_verified = false;

-- 3. Afficher les résultats
SELECT 
    'Profils email vérifiés' as opération,
    COUNT(*) as nombre
FROM public.profiles 
WHERE email_verified = true

UNION ALL

SELECT 
    'Profils admin' as opération,
    COUNT(*) as nombre
FROM public.profiles 
WHERE user_type = 'admin'

UNION ALL

SELECT 
    'Candidats' as opération,
    COUNT(*) as nombre
FROM public.candidates

UNION ALL

SELECT 
    'Entreprises' as opération,
    COUNT(*) as nombre
FROM public.companies;
