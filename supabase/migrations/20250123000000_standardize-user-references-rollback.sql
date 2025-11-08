-- ============================================
-- ROLLBACK: Standardisation des références utilisateur
-- Date: 2025-01-23
-- ATTENTION: Ce rollback nécessite une migration manuelle des données
-- ============================================

-- ============================================
-- ÉTAPE 1: Restaurer les FK vers profiles
-- ============================================

-- service_reviews
ALTER TABLE public.service_reviews
DROP CONSTRAINT IF EXISTS service_reviews_user_id_fkey;

-- Note: Pour restaurer vers profiles.id, il faudrait migrer les données manuellement
-- car auth.users.id != profiles.id. Cette opération nécessite un script de migration.

-- review_responses
ALTER TABLE public.review_responses
DROP CONSTRAINT IF EXISTS review_responses_responder_id_fkey;

-- review_reactions
ALTER TABLE public.review_reactions
DROP CONSTRAINT IF EXISTS review_reactions_user_id_fkey;

-- recruiter_subscriptions
ALTER TABLE public.recruiter_subscriptions
DROP CONSTRAINT IF EXISTS recruiter_subscriptions_user_id_fkey;

-- recruiter_usage_tracking
ALTER TABLE public.recruiter_usage_tracking
DROP CONSTRAINT IF EXISTS recruiter_usage_tracking_user_id_fkey;

-- cv_views
ALTER TABLE public.cv_views
DROP CONSTRAINT IF EXISTS cv_views_recruiter_id_fkey;
ALTER TABLE public.cv_views
DROP CONSTRAINT IF EXISTS cv_views_candidate_id_fkey;

-- training_institutions
ALTER TABLE public.training_institutions
DROP CONSTRAINT IF EXISTS training_institutions_user_id_fkey;

-- quote_requests
ALTER TABLE public.quote_requests
DROP CONSTRAINT IF EXISTS quote_requests_assigned_to_fkey;

-- ============================================
-- ÉTAPE 2: Supprimer le trigger
-- ============================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- ============================================
-- ÉTAPE 3: Restaurer les fonctions (optionnel)
-- ============================================

-- Les fonctions peuvent être restaurées depuis les migrations précédentes
-- Cette étape est optionnelle car les fonctions peuvent fonctionner avec les deux approches

-- ============================================
-- NOTE IMPORTANTE
-- ============================================
-- Ce rollback supprime uniquement les contraintes et le trigger.
-- Pour restaurer complètement vers profiles.id, il faudrait :
-- 1. Migrer les données de auth.users.id vers profiles.id correspondant
-- 2. Recréer les FK vers profiles.id
-- Cette opération est complexe et nécessite un script de migration de données personnalisé.

