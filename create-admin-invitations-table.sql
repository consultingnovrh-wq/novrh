-- Migration pour ajouter la table des invitations d'administration
-- Date: 16 juillet 2025

-- Créer la table des invitations d'administration
CREATE TABLE IF NOT EXISTS public.admin_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'moderator', 'support', 'analyst')),
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  accepted_by UUID REFERENCES auth.users(id),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer un index sur l'email pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_admin_invitations_email ON public.admin_invitations(email);
CREATE INDEX IF NOT EXISTS idx_admin_invitations_status ON public.admin_invitations(status);
CREATE INDEX IF NOT EXISTS idx_admin_invitations_expires_at ON public.admin_invitations(expires_at);

-- Activer RLS sur la table
ALTER TABLE public.admin_invitations ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS
CREATE POLICY "Admin invitations are viewable by admins" ON public.admin_invitations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
      AND p.user_type = 'admin'
    )
  );

CREATE POLICY "Admin invitations can be created by admins" ON public.admin_invitations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
      AND p.user_type = 'admin'
    )
  );

CREATE POLICY "Admin invitations can be updated by admins" ON public.admin_invitations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
      AND p.user_type = 'admin'
    )
  );

-- Créer un trigger pour mettre à jour updated_at
CREATE TRIGGER update_admin_invitations_updated_at BEFORE UPDATE ON public.admin_invitations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Accorder les permissions nécessaires
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_invitations TO authenticated;

-- Insérer quelques invitations d'exemple (optionnel)
INSERT INTO public.admin_invitations (email, role, invited_by, expires_at, message) VALUES
('moderator@novrh.com', 'moderator', (SELECT id FROM auth.users LIMIT 1), NOW() + INTERVAL '7 days', 'Invitation à rejoindre l''équipe de modération'),
('support@novrh.com', 'support', (SELECT id FROM auth.users LIMIT 1), NOW() + INTERVAL '7 days', 'Invitation à rejoindre l''équipe de support client'),
('analyst@novrh.com', 'analyst', (SELECT id FROM auth.users LIMIT 1), NOW() + INTERVAL '7 days', 'Invitation à rejoindre l''équipe d''analyse');

-- Créer une fonction pour nettoyer les invitations expirées
CREATE OR REPLACE FUNCTION public.cleanup_expired_admin_invitations()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  UPDATE public.admin_invitations 
  SET status = 'expired' 
  WHERE status = 'pending' AND expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$;

-- Créer un job pour nettoyer automatiquement les invitations expirées (tous les jours)
-- Note: Cette fonctionnalité nécessite pg_cron ou une solution similaire
-- SELECT cron.schedule('cleanup-expired-invitations', '0 0 * * *', 'SELECT public.cleanup_expired_admin_invitations();');

-- Créer une vue pour les invitations actives
CREATE OR REPLACE VIEW public.active_admin_invitations AS
SELECT 
  ai.*,
  p.email as invited_by_email,
  p.first_name as invited_by_first_name,
  p.last_name as invited_by_last_name,
  CASE 
    WHEN ai.expires_at < NOW() THEN 'Expirée'
    WHEN ai.status = 'pending' THEN 'En attente'
    WHEN ai.status = 'accepted' THEN 'Acceptée'
    WHEN ai.status = 'cancelled' THEN 'Annulée'
    ELSE ai.status
  END as status_display
FROM public.admin_invitations ai
LEFT JOIN public.profiles p ON ai.invited_by = p.user_id
WHERE ai.status IN ('pending', 'accepted')
ORDER BY ai.created_at DESC;

-- Accorder l'accès à la vue
GRANT SELECT ON public.active_admin_invitations TO authenticated;
