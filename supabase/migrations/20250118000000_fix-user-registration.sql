-- Migration pour corriger l'inscription des utilisateurs
-- Crée la fonction handle_new_user() et le trigger associé
-- Date: 2025-01-18

-- 1. Supprimer l'ancienne fonction et le trigger s'ils existent
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 2. Créer la fonction handle_new_user() qui crée automatiquement un profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email TEXT;
  user_first_name TEXT;
  user_last_name TEXT;
  user_type_value TEXT;
  user_phone TEXT;
BEGIN
  -- Récupérer les métadonnées de l'utilisateur
  user_email := NEW.email;
  user_first_name := COALESCE((NEW.raw_user_meta_data->>'first_name')::TEXT, '');
  user_last_name := COALESCE((NEW.raw_user_meta_data->>'last_name')::TEXT, '');
  user_type_value := COALESCE((NEW.raw_user_meta_data->>'user_type')::TEXT, 'candidate');
  user_phone := COALESCE((NEW.raw_user_meta_data->>'phone')::TEXT, NULL);

  -- Créer le profil dans la table profiles
  -- Utiliser ON CONFLICT pour éviter les doublons si le profil existe déjà
  INSERT INTO public.profiles (
    user_id,
    email,
    first_name,
    last_name,
    user_type,
    phone,
    is_active,
    email_verified,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    user_email,
    user_first_name,
    user_last_name,
    user_type_value,
    user_phone,
    true,
    NEW.email_confirmed_at IS NOT NULL,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, profiles.last_name),
    user_type = COALESCE(EXCLUDED.user_type, profiles.user_type),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    updated_at = NOW();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Logger l'erreur mais ne pas bloquer la création de l'utilisateur
    RAISE WARNING 'Erreur lors de la création du profil pour l''utilisateur %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- 3. Créer le trigger qui appelle la fonction lors de la création d'un utilisateur
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. S'assurer que les politiques RLS permettent la création de profils
-- (Ces politiques devraient déjà exister via fix-profiles-rls.sql, mais on les vérifie)

-- Vérifier et créer la politique d'insertion si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users can insert their own profile'
  ) THEN
    CREATE POLICY "Users can insert their own profile" ON public.profiles
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 5. Accorder les permissions nécessaires à la fonction
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- 6. Commentaire pour documentation
COMMENT ON FUNCTION public.handle_new_user() IS 
'Fonction trigger qui crée automatiquement un profil dans public.profiles lors de la création d''un utilisateur dans auth.users. Utilise SECURITY DEFINER pour contourner les politiques RLS lors de la création initiale.';

