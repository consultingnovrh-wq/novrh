-- Migration pour corriger les politiques RLS de la table candidates
-- Permet aux utilisateurs de créer leur propre profil candidat lors de l'inscription
-- Date: 2025

-- 1. Supprimer les politiques existantes sur candidates (si elles existent)
DROP POLICY IF EXISTS "Users can view their own candidate profile" ON public.candidates;
DROP POLICY IF EXISTS "Users can insert their own candidate profile" ON public.candidates;
DROP POLICY IF EXISTS "Users can update their own candidate profile" ON public.candidates;
DROP POLICY IF EXISTS "Admins can view all candidates" ON public.candidates;
DROP POLICY IF EXISTS "Admins can manage all candidates" ON public.candidates;

-- 2. S'assurer que RLS est activé sur candidates
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- 3. Créer les politiques RLS pour candidates
-- Les utilisateurs peuvent voir leur propre profil candidat
CREATE POLICY "Users can view their own candidate profile" ON public.candidates
  FOR SELECT USING (auth.uid() = user_id);

-- Les utilisateurs peuvent insérer leur propre profil candidat
-- IMPORTANT: Cette politique permet la création lors de l'inscription
CREATE POLICY "Users can insert their own candidate profile" ON public.candidates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent mettre à jour leur propre profil candidat
CREATE POLICY "Users can update their own candidate profile" ON public.candidates
  FOR UPDATE USING (auth.uid() = user_id);

-- Les admins peuvent voir tous les profils candidats
CREATE POLICY "Admins can view all candidates" ON public.candidates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.administrators a
      JOIN public.admin_roles ar ON a.role_id = ar.id
      WHERE a.user_id = auth.uid() 
      AND a.is_active = true
      AND ar.name IN ('super_admin', 'admin', 'moderator')
    )
  );

-- Les admins peuvent gérer tous les profils candidats
CREATE POLICY "Admins can manage all candidates" ON public.candidates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.administrators a
      JOIN public.admin_roles ar ON a.role_id = ar.id
      WHERE a.user_id = auth.uid() 
      AND a.is_active = true
      AND ar.name IN ('super_admin', 'admin')
    )
  );

-- 4. Faire de même pour la table companies
DROP POLICY IF EXISTS "Users can view their own company profile" ON public.companies;
DROP POLICY IF EXISTS "Users can insert their own company profile" ON public.companies;
DROP POLICY IF EXISTS "Users can update their own company profile" ON public.companies;
DROP POLICY IF EXISTS "Admins can view all companies" ON public.companies;
DROP POLICY IF EXISTS "Admins can manage all companies" ON public.companies;

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own company profile" ON public.companies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own company profile" ON public.companies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own company profile" ON public.companies
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all companies" ON public.companies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.administrators a
      JOIN public.admin_roles ar ON a.role_id = ar.id
      WHERE a.user_id = auth.uid() 
      AND a.is_active = true
      AND ar.name IN ('super_admin', 'admin', 'moderator')
    )
  );

CREATE POLICY "Admins can manage all companies" ON public.companies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.administrators a
      JOIN public.admin_roles ar ON a.role_id = ar.id
      WHERE a.user_id = auth.uid() 
      AND a.is_active = true
      AND ar.name IN ('super_admin', 'admin')
    )
  );

