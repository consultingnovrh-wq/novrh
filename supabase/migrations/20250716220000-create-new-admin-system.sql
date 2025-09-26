-- Migration pour créer un nouveau système d'administration moderne
-- Système simple et efficace avec gestion des rôles
-- Date: 16 juillet 2025

-- 1. Ajouter le type 'admin' à la table profiles
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_user_type_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_type_check 
CHECK (user_type IN ('candidate', 'employer', 'student', 'company', 'admin'));

-- 2. Créer la table des rôles d'administration
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Créer la table des administrateurs
CREATE TABLE IF NOT EXISTS public.administrators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.admin_roles(id) ON DELETE RESTRICT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- 4. Créer la table des actions d'administration (audit)
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES public.administrators(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Créer la table des paramètres système
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  updated_by UUID REFERENCES public.administrators(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Activer RLS sur toutes les nouvelles tables
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.administrators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- 7. Créer les politiques RLS pour admin_roles
CREATE POLICY "Admin roles are viewable by admins" ON public.admin_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.administrators a
      JOIN public.profiles p ON a.user_id = p.user_id
      WHERE p.user_id = auth.uid() AND p.user_type = 'admin'
    )
  );

CREATE POLICY "Admin roles can be managed by super admins" ON public.admin_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.administrators a
      JOIN public.admin_roles ar ON a.role_id = ar.id
      JOIN public.profiles p ON a.user_id = p.user_id
      WHERE p.user_id = auth.uid() 
      AND p.user_type = 'admin'
      AND ar.name = 'super_admin'
    )
  );

-- 8. Créer les politiques RLS pour administrators
CREATE POLICY "Administrators can view their own record" ON public.administrators
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Administrators can view all administrators" ON public.administrators
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.user_type = 'admin'
    )
  );

CREATE POLICY "Super admins can manage administrators" ON public.administrators
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.administrators a
      JOIN public.admin_roles ar ON a.role_id = ar.id
      JOIN public.profiles p ON a.user_id = p.user_id
      WHERE p.user_id = auth.uid() 
      AND p.user_type = 'admin'
      AND ar.name = 'super_admin'
    )
  );

-- 9. Créer les politiques RLS pour admin_logs
CREATE POLICY "Admins can view admin logs" ON public.admin_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.user_type = 'admin'
    )
  );

CREATE POLICY "Admins can create admin logs" ON public.admin_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.user_type = 'admin'
    )
  );

-- 10. Créer les politiques RLS pour system_settings
CREATE POLICY "Public settings are viewable by everyone" ON public.system_settings
  FOR SELECT USING (is_public = true);

CREATE POLICY "Admins can view all settings" ON public.system_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.user_type = 'admin'
    )
  );

CREATE POLICY "Admins can update settings" ON public.system_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.user_type = 'admin'
    )
  );

-- 11. Créer les index pour les performances
CREATE INDEX IF NOT EXISTS idx_administrators_user_id ON public.administrators(user_id);
CREATE INDEX IF NOT EXISTS idx_administrators_role_id ON public.administrators(role_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON public.admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON public.admin_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON public.system_settings(key);

-- 12. Créer les triggers pour updated_at
CREATE TRIGGER update_admin_roles_updated_at BEFORE UPDATE ON public.admin_roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_administrators_updated_at BEFORE UPDATE ON public.administrators
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON public.system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 13. Insérer les rôles par défaut
INSERT INTO public.admin_roles (name, display_name, description, permissions, is_active) VALUES
('super_admin', 'Super Administrateur', 'Accès complet à toutes les fonctionnalités', 
 '{"users": true, "companies": true, "jobs": true, "candidates": true, "settings": true, "reports": true, "roles": true}', true),
('admin', 'Administrateur', 'Gestion complète des utilisateurs et contenus', 
 '{"users": true, "companies": true, "jobs": true, "candidates": true, "reports": true}', true),
('moderator', 'Modérateur', 'Modération des contenus et validation', 
 '{"jobs": true, "candidates": true, "companies": true}', true),
('support', 'Support Client', 'Support utilisateur et assistance', 
 '{"users": true, "candidates": true}', true),
('analyst', 'Analyste', 'Accès aux rapports et statistiques', 
 '{"reports": true}', true);

-- 14. Insérer les paramètres système par défaut
INSERT INTO public.system_settings (key, value, description, is_public) VALUES
('site_name', '"NovRH Consulting"', 'Nom du site', true),
('site_description', '"Plateforme RH Panafricaine"', 'Description du site', true),
('maintenance_mode', 'false', 'Mode maintenance', true),
('registration_enabled', 'true', 'Inscription activée', false),
('email_notifications', 'true', 'Notifications email', false);

-- 15. Accorder les permissions nécessaires
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_roles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.administrators TO authenticated;
GRANT SELECT, INSERT ON public.admin_logs TO authenticated;
GRANT SELECT, UPDATE ON public.system_settings TO authenticated;

-- 16. Message de confirmation
SELECT 'Nouveau système d''administration créé avec succès' as status;
