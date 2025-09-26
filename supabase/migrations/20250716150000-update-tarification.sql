-- Migration pour mettre à jour la tarification selon les spécifications exactes
-- Suppression des anciens plans et insertion des nouveaux

-- Supprimer les anciens plans
DELETE FROM public.subscription_plans;
DELETE FROM public.service_access;

-- Réinitialiser les séquences
ALTER SEQUENCE IF EXISTS public.subscription_plans_id_seq RESTART WITH 1;

-- Insérer les nouveaux plans d'abonnement pour les étudiants
INSERT INTO public.subscription_plans (id, name, description, price, currency, duration_days, features, is_active, created_at, updated_at) VALUES
-- Étudiants internationaux (France ou à l'étranger - hors Mali)
('550e8400-e29b-41d4-a716-446655440001', 'Coaching CV Étudiant International', 'Coaching CV personnalisé pour étudiants internationaux', 15.00, 'EUR', 365, '["Coaching CV personnalisé", "Accompagnement expert", "Support en ligne"]', true, now(), now()),
('550e8400-e29b-41d4-a716-446655440002', 'Lettre de motivation Étudiant International', 'Rédaction de lettre de motivation pour étudiants internationaux', 15.00, 'EUR', 365, '["Lettre de motivation personnalisée", "Accompagnement expert", "Support en ligne"]', true, now(), now()),
('550e8400-e29b-41d4-a716-446655440003', 'Pack CV + Lettre Étudiant International', 'Pack complet CV + Lettre de motivation pour étudiants internationaux', 20.00, 'EUR', 365, '["Coaching CV personnalisé", "Lettre de motivation personnalisée", "Accompagnement expert", "Support en ligne", "Réduction de 10€"]', true, now(), now()),

-- Étudiants maliens vivant au Mali
('550e8400-e29b-41d4-a716-446655440004', 'Coaching CV Étudiant Malien', 'Coaching CV personnalisé pour étudiants maliens', 5000.00, 'XOF', 365, '["Coaching CV personnalisé", "Accompagnement expert", "Support en ligne"]', true, now(), now()),
('550e8400-e29b-41d4-a716-446655440005', 'Lettre de motivation Étudiant Malien', 'Rédaction de lettre de motivation pour étudiants maliens', 5000.00, 'XOF', 365, '["Lettre de motivation personnalisée", "Accompagnement expert", "Support en ligne"]', true, now(), now()),
('550e8400-e29b-41d4-a716-446655440006', 'Pack CV + Lettre Étudiant Malien', 'Pack complet CV + Lettre de motivation pour étudiants maliens', 7500.00, 'XOF', 365, '["Coaching CV personnalisé", "Lettre de motivation personnalisée", "Accompagnement expert", "Support en ligne", "Réduction de 2 500 FCFA"]', true, now(), now()),

-- Abonnements entreprises - Recrutement complet
('550e8400-e29b-41d4-a716-446655440007', 'Recrutement Complet 0-100 salariés', 'Recrutement complet de la publication à l''intégration pour entreprises de 0 à 100 salariés', 1500000.00, 'XOF', 365, '["Recrutement complet", "Publication d''annonces", "Suivi des candidatures", "Accompagnement à l''intégration", "Support dédié"]', true, now(), now()),
('550e8400-e29b-41d4-a716-446655440008', 'Recrutement Complet 0-500 salariés', 'Recrutement complet de la publication à l''intégration pour entreprises de 0 à 500 salariés', 2000000.00, 'XOF', 365, '["Recrutement complet", "Publication d''annonces", "Suivi des candidatures", "Accompagnement à l''intégration", "Support dédié", "Gestion des volumes"]', true, now(), now()),
('550e8400-e29b-41d4-a716-446655440009', 'Recrutement Complet 500+ salariés', 'Recrutement complet de la publication à l''intégration pour entreprises de 500+ salariés', 3000000.00, 'XOF', 365, '["Recrutement complet", "Publication d''annonces", "Suivi des candidatures", "Accompagnement à l''intégration", "Support dédié", "Gestion des volumes", "Accompagnement stratégique"]', true, now(), now()),

-- Abonnements entreprises - Recrutement partiel
('550e8400-e29b-41d4-a716-446655440010', 'Recrutement Partiel 0-100 salariés', 'Recrutement à partir de l''annonce sur notre site avec suivi depuis l''espace employeur pour entreprises de 0 à 100 salariés', 700000.00, 'XOF', 365, '["Publication d''annonces", "Suivi depuis espace employeur", "Support technique", "Accompagnement léger"]', true, now(), now()),
('550e8400-e29b-41d4-a716-446655440011', 'Recrutement Partiel 0-500 salariés', 'Recrutement à partir de l''annonce sur notre site avec suivi depuis l''espace employeur pour entreprises de 0 à 500 salariés', 1000000.00, 'XOF', 365, '["Publication d''annonces", "Suivi depuis espace employeur", "Support technique", "Accompagnement léger", "Gestion des volumes"]', true, now(), now()),
('550e8400-e29b-41d4-a716-446655440012', 'Recrutement Partiel 500+ salariés', 'Recrutement à partir de l''annonce sur notre site avec suivi depuis l''espace employeur pour entreprises de 0 à 500 salariés', 1500000.00, 'XOF', 365, '["Publication d''annonces", "Suivi depuis espace employeur", "Support technique", "Accompagnement léger", "Gestion des volumes", "Support avancé"]', true, now(), now()),

-- Abonnements entreprises - Recrutement en autonomie
('550e8400-e29b-41d4-a716-446655440013', 'Recrutement Autonomie', 'Recrutement en autonomie avec accompagnement léger', 500000.00, 'XOF', 365, '["Accès à la plateforme", "Publication d''annonces", "Accompagnement léger", "Support de base"]', true, now(), now()),

-- Plans mensuels pour entreprises (conversion des tarifs annuels)
('550e8400-e29b-41d4-a716-446655440014', 'Recrutement Complet 0-100 salariés (Mensuel)', 'Recrutement complet de la publication à l''intégration pour entreprises de 0 à 100 salariés - Abonnement mensuel', 150000.00, 'XOF', 30, '["Recrutement complet", "Publication d''annonces", "Suivi des candidatures", "Accompagnement à l''intégration", "Support dédié"]', true, now(), now()),
('550e8400-e29b-41d4-a716-446655440015', 'Recrutement Complet 0-500 salariés (Mensuel)', 'Recrutement complet de la publication à l''intégration pour entreprises de 0 à 500 salariés - Abonnement mensuel', 200000.00, 'XOF', 30, '["Recrutement complet", "Publication d''annonces", "Suivi des candidatures", "Accompagnement à l''intégration", "Support dédié", "Gestion des volumes"]', true, now(), now()),
('550e8400-e29b-41d4-a716-446655440016', 'Recrutement Complet 500+ salariés (Mensuel)', 'Recrutement complet de la publication à l''intégration pour entreprises de 500+ salariés - Abonnement mensuel', 300000.00, 'XOF', 30, '["Recrutement complet", "Publication d''annonces", "Suivi des candidatures", "Accompagnement à l''intégration", "Support dédié", "Gestion des volumes", "Accompagnement stratégique"]', true, now(), now()),
('550e8400-e29b-41d4-a716-446655440017', 'Recrutement Partiel 0-100 salariés (Mensuel)', 'Recrutement à partir de l''annonce sur notre site avec suivi depuis l''espace employeur pour entreprises de 0 à 100 salariés - Abonnement mensuel', 70000.00, 'XOF', 30, '["Publication d''annonces", "Suivi depuis espace employeur", "Support technique", "Accompagnement léger"]', true, now(), now()),
('550e8400-e29b-41d4-a716-446655440018', 'Recrutement Partiel 0-500 salariés (Mensuel)', 'Recrutement à partir de l''annonce sur notre site avec suivi depuis l''espace employeur pour entreprises de 0 à 500 salariés - Abonnement mensuel', 100000.00, 'XOF', 30, '["Publication d''annonces", "Suivi depuis espace employeur", "Support technique", "Accompagnement léger", "Gestion des volumes"]', true, now(), now()),
('550e8400-e29b-41d4-a716-446655440019', 'Recrutement Partiel 500+ salariés (Mensuel)', 'Recrutement à partir de l''annonce sur notre site avec suivi depuis l''espace employeur pour entreprises de 0 à 500 salariés - Abonnement mensuel', 150000.00, 'XOF', 30, '["Publication d''annonces", "Suivi depuis espace employeur", "Support technique", "Accompagnement léger", "Gestion des volumes", "Support avancé"]', true, now(), now()),
('550e8400-e29b-41d4-a716-446655440020', 'Recrutement Autonomie (Mensuel)', 'Recrutement en autonomie avec accompagnement léger - Abonnement mensuel', 45000.00, 'XOF', 30, '["Accès à la plateforme", "Publication d''annonces", "Accompagnement léger", "Support de base"]', true, now(), now());

-- Insérer les règles d'accès aux services
INSERT INTO public.service_access (id, service_name, service_description, requires_subscription, required_plan_types, is_active, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440021', 'Coaching CV Étudiant', 'Service de coaching CV pour étudiants', true, ARRAY['student_coaching'], true, now(), now()),
('550e8400-e29b-41d4-a716-446655440022', 'Lettre de motivation Étudiant', 'Service de rédaction de lettre de motivation pour étudiants', true, ARRAY['student_coaching'], true, now(), now()),
('550e8400-e29b-41d4-a716-446655440023', 'Pack CV + Lettre Étudiant', 'Pack complet CV + Lettre de motivation pour étudiants', true, ARRAY['student_coaching'], true, now(), now()),
('550e8400-e29b-41d4-a716-446655440024', 'Poster une offre', 'Publication d''offres d''emploi sur la plateforme', true, ARRAY['recruitment_complete', 'recruitment_partial', 'recruitment_autonomy'], true, now(), now()),
('550e8400-e29b-41d4-a716-446655440025', 'Espace employeur', 'Accès à l''espace employeur avec suivi des candidatures', true, ARRAY['recruitment_complete', 'recruitment_partial'], true, now(), now()),
('550e8400-e29b-41d4-a716-446655440026', 'Recrutement complet', 'Service de recrutement complet de la publication à l''intégration', true, ARRAY['recruitment_complete'], true, now(), now()),
('550e8400-e29b-41d4-a716-446655440027', 'Accompagnement intégration', 'Accompagnement à l''intégration des nouveaux employés', true, ARRAY['recruitment_complete'], true, now(), now()),
('550e8400-e29b-41d4-a716-446655440028', 'Support dédié', 'Support dédié pour les services de recrutement', true, ARRAY['recruitment_complete'], true, now(), now()),
('550e8400-e29b-41d4-a716-446655440029', 'Gestion des volumes', 'Gestion des volumes de recrutement pour grandes entreprises', true, ARRAY['recruitment_complete', 'recruitment_partial'], true, now(), now()),
('550e8400-e29b-41d4-a716-446655440030', 'Accompagnement stratégique', 'Accompagnement stratégique pour grandes entreprises', true, ARRAY['recruitment_complete'], true, now(), now());

-- Mettre à jour la fonction check_service_access pour gérer les nouveaux types de plans
CREATE OR REPLACE FUNCTION public.check_service_access(
  service_name text,
  user_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_subscription_record record;
  plan_features jsonb;
  service_plan_types text[];
  user_type text;
BEGIN
  -- Si pas d'utilisateur connecté, refuser l'accès
  IF user_id IS NULL THEN
    RETURN false;
  END IF;

  -- Récupérer le type d'utilisateur
  SELECT user_type INTO user_type FROM auth.users WHERE id = user_id;
  
  -- Récupérer l'abonnement actif de l'utilisateur
  SELECT us.*, sp.features, sp.currency
  INTO user_subscription_record
  FROM public.user_subscriptions us
  JOIN public.subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = check_service_access.user_id
    AND us.status = 'active'
    AND us.end_date > now()
  ORDER BY us.created_at DESC
  LIMIT 1;

  -- Si pas d'abonnement actif, vérifier si le service est gratuit
  IF user_subscription_record IS NULL THEN
    SELECT requires_subscription INTO user_subscription_record.requires_subscription
    FROM public.service_access
    WHERE service_name = check_service_access.service_name
      AND is_active = true;
    
    RETURN COALESCE(user_subscription_record.requires_subscription, false) = false;
  END IF;

  -- Récupérer les types de plans requis pour ce service
  SELECT required_plan_types INTO service_plan_types
  FROM public.service_access
  WHERE service_name = check_service_access.service_name
    AND is_active = true;

  -- Si pas de types requis, refuser l'accès
  IF service_plan_types IS NULL OR array_length(service_plan_types, 1) IS NULL THEN
    RETURN false;
  END IF;

  -- Vérifier si l'abonnement actuel correspond aux types requis
  -- Logique basée sur le nom du plan et les fonctionnalités
  IF user_subscription_record.currency = 'EUR' AND user_subscription_record.features::text LIKE '%Étudiant International%' THEN
    -- Étudiant international
    RETURN 'student_coaching' = ANY(service_plan_types);
  ELSIF user_subscription_record.currency = 'XOF' AND user_subscription_record.features::text LIKE '%Étudiant Malien%' THEN
    -- Étudiant malien
    RETURN 'student_coaching' = ANY(service_plan_types);
  ELSIF user_subscription_record.features::text LIKE '%Recrutement Complet%' THEN
    -- Recrutement complet
    RETURN 'recruitment_complete' = ANY(service_plan_types);
  ELSIF user_subscription_record.features::text LIKE '%Recrutement Partiel%' THEN
    -- Recrutement partiel
    RETURN 'recruitment_partial' = ANY(service_plan_types);
  ELSIF user_subscription_record.features::text LIKE '%Recrutement Autonomie%' THEN
    -- Recrutement en autonomie
    RETURN 'recruitment_autonomy' = ANY(service_plan_types);
  END IF;

  RETURN false;
END;
$$;
