-- Migration pour corriger les politiques RLS et permettre la création de comptes
-- Date: 16 juillet 2025

-- 1. Supprimer TOUTES les politiques RLS existantes pour éviter les conflits
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation during registration" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- 2. Supprimer les politiques pour candidates
DROP POLICY IF EXISTS "Candidates can view their own profile" ON public.candidates;
DROP POLICY IF EXISTS "Candidates can insert their own profile" ON public.candidates;
DROP POLICY IF EXISTS "Candidates can update their own profile" ON public.candidates;
DROP POLICY IF EXISTS "Allow candidate creation during registration" ON public.candidates;

-- 3. Supprimer les politiques pour companies
DROP POLICY IF EXISTS "Companies can view their own profile" ON public.companies;
DROP POLICY IF EXISTS "Companies can insert their own profile" ON public.companies;
DROP POLICY IF EXISTS "Companies can update their own profile" ON public.companies;
DROP POLICY IF EXISTS "Allow company creation during registration" ON public.companies;

-- 4. Créer des politiques RLS plus permissives pour profiles
CREATE POLICY "Allow profile creation during registration"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- 5. Créer des politiques RLS pour candidates
CREATE POLICY "Allow candidate creation during registration"
  ON public.candidates FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Candidates can view their own profile"
  ON public.candidates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Candidates can update their own profile"
  ON public.candidates FOR UPDATE
  USING (auth.uid() = user_id);

-- 6. Créer des politiques RLS pour companies
CREATE POLICY "Allow company creation during registration"
  ON public.companies FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Companies can view their own profile"
  ON public.companies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Companies can update their own profile"
  ON public.companies FOR UPDATE
  USING (auth.uid() = user_id);

-- 7. Ajouter une politique pour les administrateurs
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND user_type = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND user_type = 'admin'
    )
  );

-- 8. Ajouter des colonnes manquantes à la table profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

-- 9. Mettre à jour la contrainte user_type pour inclure 'admin'
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_user_type_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_type_check 
CHECK (user_type IN ('candidate', 'employer', 'student', 'company', 'admin'));

-- 10. Créer un trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 11. Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON public.profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
