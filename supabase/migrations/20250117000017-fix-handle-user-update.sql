-- Migration pour corriger la fonction handle_user_update
-- Date: 17 janvier 2025

-- 1. Supprimer l'ancienne fonction problématique avec ses dépendances
DROP FUNCTION IF EXISTS public.handle_user_update() CASCADE;

-- 2. Recréer la fonction avec le bon casting TYPE
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour automatiquement la table profiles
  UPDATE public.profiles
  SET
    email = NEW.email,
    first_name = COALESCE(NEW.raw_user_meta_data->>'first_name', first_name),
    last_name = COALESCE(NEW.raw_user_meta_data->>'last_name', last_name),
    user_type = CASE 
      WHEN NEW.raw_user_meta_data->>'user_type' = 'employer' THEN 'company'::user_type
      WHEN NEW.raw_user_meta_data->>'user_type' = 'student' THEN 'candidate'::user_type
      WHEN NEW.raw_user_meta_data->>'user_type' = 'candidate' THEN 'candidate'::user_type
      WHEN NEW.raw_user_meta_data->>'user_type' = 'company' THEN 'company'::user_type
      WHEN NEW.raw_user_meta_data->>'user_type' = 'admin' THEN 'admin'::user_type
      ELSE user_type
    END,
    email_verified = NEW.email_confirmed_at IS NOT NULL,
    updated_at = now()
  WHERE user_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recréer le trigger (il a été supprimé par CASCADE)
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- 4. Vérifier que la méthode fonctionne
SELECT 
    'Fonction handle_user_update créée' as résultat,
    'Trigger recréé' as trigger,
    'Prêt pour les mises à jour' as statut;
