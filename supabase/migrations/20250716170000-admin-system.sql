-- Migration pour ajouter le système d'administration et gestion des collaborateurs
-- Date: 16 juillet 2025

-- 1. Ajouter le type 'admin' aux types d'utilisateurs existants
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_type_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_type_check 
  CHECK (user_type IN ('candidate', 'employer', 'student', 'company', 'admin'));

-- 2. Créer la table des équipes d'administration
CREATE TABLE IF NOT EXISTS public.admin_teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Créer la table des membres d'équipe avec rôles
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.admin_teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'moderator', 'viewer')),
  permissions JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- 4. Créer la table des actions d'administration (audit trail)
CREATE TABLE IF NOT EXISTS public.admin_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Créer la table des paramètres du site
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Activer RLS sur les nouvelles tables
ALTER TABLE public.admin_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 7. Créer les politiques RLS pour admin_teams
CREATE POLICY "Admin teams are viewable by team members" ON public.admin_teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = admin_teams.id
      AND tm.user_id = auth.uid()
      AND tm.is_active = true
    )
  );

CREATE POLICY "Admin teams can be created by admins" ON public.admin_teams
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
      AND p.user_type = 'admin'
    )
  );

CREATE POLICY "Admin teams can be updated by team owners and admins" ON public.admin_teams
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = admin_teams.id
      AND tm.user_id = auth.uid()
      AND tm.role IN ('owner', 'admin')
      AND tm.is_active = true
    )
  );

-- 8. Créer les politiques RLS pour team_members
CREATE POLICY "Team members can view their team membership" ON public.team_members
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = auth.uid()
      AND tm.role IN ('owner', 'admin')
      AND tm.is_active = true
    )
  );

CREATE POLICY "Team members can be managed by team owners and admins" ON public.team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = auth.uid()
      AND tm.role IN ('owner', 'admin')
      AND tm.is_active = true
    )
  );

-- 9. Créer les politiques RLS pour admin_actions
CREATE POLICY "Admin actions are viewable by admins" ON public.admin_actions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
      AND p.user_type = 'admin'
    )
  );

CREATE POLICY "Admin actions can be created by authenticated users" ON public.admin_actions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 10. Créer les politiques RLS pour site_settings
CREATE POLICY "Public settings are viewable by everyone" ON public.site_settings
  FOR SELECT USING (is_public = true);

CREATE POLICY "All settings are viewable by admins" ON public.site_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
      AND p.user_type = 'admin'
    )
  );

CREATE POLICY "Settings can be updated by admins" ON public.site_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
      AND p.user_type = 'admin'
    )
  );

-- 11. Créer les index pour les performances
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_user_id ON public.admin_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_action_type ON public.admin_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_actions_created_at ON public.admin_actions(created_at);

-- 12. Créer la fonction pour vérifier les permissions d'administration
CREATE OR REPLACE FUNCTION public.check_admin_permission(
  required_role TEXT DEFAULT 'admin',
  team_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_profile RECORD;
  team_member RECORD;
BEGIN
  -- Vérifier si l'utilisateur est connecté
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  -- Récupérer le profil de l'utilisateur
  SELECT user_type INTO user_profile
  FROM public.profiles
  WHERE user_id = auth.uid();

  -- Si c'est un admin global, autoriser
  IF user_profile.user_type = 'admin' THEN
    RETURN true;
  END IF;

  -- Si un team_id est spécifié, vérifier les permissions d'équipe
  IF team_id IS NOT NULL THEN
    SELECT tm.role, tm.permissions INTO team_member
    FROM public.team_members tm
    WHERE tm.team_id = check_admin_permission.team_id
      AND tm.user_id = auth.uid()
      AND tm.is_active = true;

    IF team_member IS NOT NULL THEN
      -- Vérifier le rôle requis
      CASE required_role
        WHEN 'owner' THEN
          RETURN team_member.role = 'owner';
        WHEN 'admin' THEN
          RETURN team_member.role IN ('owner', 'admin');
        WHEN 'moderator' THEN
          RETURN team_member.role IN ('owner', 'admin', 'moderator');
        WHEN 'viewer' THEN
          RETURN team_member.role IN ('owner', 'admin', 'moderator', 'viewer');
        ELSE
          RETURN false;
      END CASE;
    END IF;
  END IF;

  RETURN false;
END;
$$;

-- 13. Créer la fonction pour logger les actions d'administration
CREATE OR REPLACE FUNCTION public.log_admin_action(
  action_type TEXT,
  target_type TEXT,
  target_id UUID DEFAULT NULL,
  details JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  action_id UUID;
BEGIN
  INSERT INTO public.admin_actions (
    user_id,
    action_type,
    target_type,
    target_id,
    details,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    action_type,
    target_type,
    target_id,
    details,
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  ) RETURNING id INTO action_id;

  RETURN action_id;
END;
$$;

-- 14. Insérer l'équipe d'administration par défaut
INSERT INTO public.admin_teams (id, team_name, description) VALUES
('550e8400-e29b-41d4-a716-446655440031', 'Équipe NovRH', 'Équipe principale d''administration de NovRH');

-- 15. Insérer les paramètres du site par défaut
INSERT INTO public.site_settings (setting_key, setting_value, description, is_public) VALUES
('site_maintenance', '{"enabled": false, "message": "Site en maintenance"}', 'Paramètres de maintenance', true),
('site_announcements', '{"enabled": false, "message": ""}', 'Annonces du site', true),
('registration_settings', '{"enabled": true, "require_approval": false}', 'Paramètres d''inscription', false),
('email_settings', '{"smtp_enabled": false, "from_email": "noreply@novrh.com"}', 'Paramètres email', false);

-- 16. Créer un trigger pour mettre à jour updated_at
CREATE TRIGGER update_admin_teams_updated_at BEFORE UPDATE ON public.admin_teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 17. Accorder les permissions nécessaires
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_teams TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT SELECT, INSERT ON public.admin_actions TO authenticated;
GRANT SELECT, UPDATE ON public.site_settings TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_admin_permission TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_admin_action TO authenticated;
