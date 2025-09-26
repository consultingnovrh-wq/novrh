-- Migration de nettoyage complet du système admin
-- Supprime toutes les tables et références admin existantes
-- Date: 16 juillet 2025

-- 1. Supprimer toutes les tables d'administration existantes
DROP TABLE IF EXISTS public.admin_actions CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.admin_teams CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;
DROP TABLE IF EXISTS public.admin_invitations CASCADE;

-- 2. Supprimer toutes les fonctions admin
DROP FUNCTION IF EXISTS public.check_admin_permission(TEXT, UUID);
DROP FUNCTION IF EXISTS public.log_admin_action(TEXT, TEXT, UUID, JSONB);

-- 3. Supprimer toutes les politiques RLS liées aux admins
DROP POLICY IF EXISTS "Admin teams are viewable by team members" ON public.admin_teams;
DROP POLICY IF EXISTS "Admin teams can be created by admins" ON public.admin_teams;
DROP POLICY IF EXISTS "Admin teams can be updated by team owners and admins" ON public.admin_teams;
DROP POLICY IF EXISTS "Team members can view their team membership" ON public.team_members;
DROP POLICY IF EXISTS "Team members can be managed by team owners and admins" ON public.team_members;
DROP POLICY IF EXISTS "Admin actions are viewable by admins" ON public.admin_actions;
DROP POLICY IF EXISTS "Admin actions can be created by authenticated users" ON public.admin_actions;
DROP POLICY IF EXISTS "Public settings are viewable by everyone" ON public.site_settings;
DROP POLICY IF EXISTS "All settings are viewable by admins" ON public.site_settings;
DROP POLICY IF EXISTS "Settings can be updated by admins" ON public.site_settings;

-- 4. Supprimer les index admin
DROP INDEX IF EXISTS idx_team_members_team_id;
DROP INDEX IF EXISTS idx_team_members_user_id;
DROP INDEX IF EXISTS idx_admin_actions_user_id;
DROP INDEX IF EXISTS idx_admin_actions_action_type;
DROP INDEX IF EXISTS idx_admin_actions_created_at;

-- 5. Supprimer les triggers admin
DROP TRIGGER IF EXISTS update_admin_teams_updated_at ON public.admin_teams;
DROP TRIGGER IF EXISTS update_team_members_updated_at ON public.team_members;
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;

-- 6. Nettoyer la table profiles - supprimer le type 'admin' temporairement
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_user_type_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_type_check 
CHECK (user_type IN ('candidate', 'employer', 'student', 'company'));

-- 7. Supprimer tous les profils admin existants
DELETE FROM public.profiles WHERE user_type = 'admin';

-- 8. Nettoyer les permissions
REVOKE ALL ON public.admin_teams FROM anon, authenticated;
REVOKE ALL ON public.team_members FROM anon, authenticated;
REVOKE ALL ON public.admin_actions FROM anon, authenticated;
REVOKE ALL ON public.site_settings FROM anon, authenticated;

-- 9. Message de confirmation
SELECT 'Système admin nettoyé avec succès' as status;
