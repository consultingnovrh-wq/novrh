-- Script pour vérifier le type user_type dans la base de données
-- À exécuter dans Supabase SQL Editor

-- 1. Vérifier le type de la colonne user_type
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name = 'user_type';

-- 2. Vérifier les contraintes sur user_type
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc 
ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'profiles' 
AND tc.constraint_type = 'CHECK'
AND cc.check_clause LIKE '%user_type%';

-- 3. Vérifier s'il existe un type ENUM user_type
SELECT 
    typname,
    enumlabel
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid 
WHERE typname = 'user_type'
ORDER BY e.enumsortorder;

-- 4. Lister les valeurs actuelles dans la table profiles
SELECT 
    user_type,
    COUNT(*) as count
FROM public.profiles 
GROUP BY user_type
ORDER BY user_type;
