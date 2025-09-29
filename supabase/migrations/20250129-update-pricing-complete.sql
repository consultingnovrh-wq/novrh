-- Migration pour mettre à jour la tarification selon les nouvelles informations
-- Date: 2025-01-29

-- Supprimer les anciens plans pour les remplacer
DELETE FROM public.pricing_plans WHERE category IN ('student_international', 'student_mali', 'business_complete', 'business_partial', 'business_autonomy', 'education');

-- Insérer les nouveaux plans de tarification

-- Services étudiants internationaux (France ou à l'étranger – hors Mali)
INSERT INTO public.pricing_plans (name, description, price, currency, billing_cycle, features, category) VALUES
('Coaching CV International', 'Coaching CV pour étudiants internationaux (France ou à l\'étranger – hors Mali)', 15.00, 'EUR', 'one_time', '["cv_coaching", "cv_review", "cv_optimization", "personalized_feedback"], 'student_international'),
('Lettre de motivation International', 'Lettre de motivation pour étudiants internationaux (France ou à l\'étranger – hors Mali)', 15.00, 'EUR', 'one_time', '["motivation_letter", "letter_review", "letter_optimization", "personalized_feedback"], 'student_international'),
('Pack CV + Lettre International', 'Pack complet CV + Lettre de motivation pour étudiants internationaux', 20.00, 'EUR', 'one_time', '["cv_coaching", "cv_review", "cv_optimization", "motivation_letter", "letter_review", "letter_optimization", "personalized_feedback", "discount_pack"], 'student_international');

-- Services étudiants maliens (vivant au Mali)
INSERT INTO public.pricing_plans (name, description, price, currency, billing_cycle, features, category) VALUES
('Coaching CV Mali', 'Coaching CV pour étudiants maliens vivant au Mali', 5000.00, 'FCFA', 'one_time', '["cv_coaching", "cv_review", "cv_optimization", "personalized_feedback"], 'student_mali'),
('Lettre de motivation Mali', 'Lettre de motivation pour étudiants maliens vivant au Mali', 5000.00, 'FCFA', 'one_time', '["motivation_letter", "letter_review", "letter_optimization", "personalized_feedback"], 'student_mali'),
('Pack CV + Lettre Mali', 'Pack complet CV + Lettre de motivation pour étudiants maliens', 7500.00, 'FCFA', 'one_time', '["cv_coaching", "cv_review", "cv_optimization", "motivation_letter", "letter_review", "letter_optimization", "personalized_feedback", "discount_pack"], 'student_mali');

-- Abonnements entreprises - Recrutement complet (Mensuel)
INSERT INTO public.pricing_plans (name, description, price, currency, billing_cycle, features, category) VALUES
('Recrutement Complet 0-100 (Mensuel)', 'Recrutement complet pour entreprises de 0 à 100 salariés - Mensuel', 150000.00, 'FCFA', 'monthly', '["recruitment_complete", "job_posting", "cv_access", "candidate_screening", "interview_coordination", "integration_support", "hr_consulting"], 'business_complete_monthly'),
('Recrutement Complet 0-500 (Mensuel)', 'Recrutement complet pour entreprises de 0 à 500 salariés - Mensuel', 200000.00, 'FCFA', 'monthly', '["recruitment_complete", "job_posting", "cv_access", "candidate_screening", "interview_coordination", "integration_support", "hr_consulting"], 'business_complete_monthly'),
('Recrutement Complet 500+ (Mensuel)', 'Recrutement complet pour entreprises de 500+ salariés - Mensuel', 300000.00, 'FCFA', 'monthly', '["recruitment_complete", "job_posting", "cv_access", "candidate_screening", "interview_coordination", "integration_support", "hr_consulting", "priority_support"], 'business_complete_monthly');

-- Abonnements entreprises - Recrutement complet (Annuel)
INSERT INTO public.pricing_plans (name, description, price, currency, billing_cycle, features, category) VALUES
('Recrutement Complet 0-100 (Annuel)', 'Recrutement complet pour entreprises de 0 à 100 salariés - Annuel', 1500000.00, 'FCFA', 'yearly', '["recruitment_complete", "job_posting", "cv_access", "candidate_screening", "interview_coordination", "integration_support", "hr_consulting", "annual_discount"], 'business_complete_yearly'),
('Recrutement Complet 0-500 (Annuel)', 'Recrutement complet pour entreprises de 0 à 500 salariés - Annuel', 2000000.00, 'FCFA', 'yearly', '["recruitment_complete", "job_posting", "cv_access", "candidate_screening", "interview_coordination", "integration_support", "hr_consulting", "annual_discount"], 'business_complete_yearly'),
('Recrutement Complet 500+ (Annuel)', 'Recrutement complet pour entreprises de 500+ salariés - Annuel', 3000000.00, 'FCFA', 'yearly', '["recruitment_complete", "job_posting", "cv_access", "candidate_screening", "interview_coordination", "integration_support", "hr_consulting", "priority_support", "annual_discount"], 'business_complete_yearly');

-- Abonnements entreprises - Recrutement partiel (Mensuel)
INSERT INTO public.pricing_plans (name, description, price, currency, billing_cycle, features, category) VALUES
('Recrutement Partiel 0-100 (Mensuel)', 'Recrutement partiel pour entreprises de 0 à 100 salariés - Mensuel', 70000.00, 'FCFA', 'monthly', '["recruitment_partial", "job_posting", "cv_access", "candidate_screening", "employer_support"], 'business_partial_monthly'),
('Recrutement Partiel 0-500 (Mensuel)', 'Recrutement partiel pour entreprises de 0 à 500 salariés - Mensuel', 100000.00, 'FCFA', 'monthly', '["recruitment_partial", "job_posting", "cv_access", "candidate_screening", "employer_support"], 'business_partial_monthly'),
('Recrutement Partiel 500+ (Mensuel)', 'Recrutement partiel pour entreprises de 500+ salariés - Mensuel', 150000.00, 'FCFA', 'monthly', '["recruitment_partial", "job_posting", "cv_access", "candidate_screening", "employer_support", "priority_support"], 'business_partial_monthly');

-- Abonnements entreprises - Recrutement partiel (Annuel)
INSERT INTO public.pricing_plans (name, description, price, currency, billing_cycle, features, category) VALUES
('Recrutement Partiel 0-100 (Annuel)', 'Recrutement partiel pour entreprises de 0 à 100 salariés - Annuel', 700000.00, 'FCFA', 'yearly', '["recruitment_partial", "job_posting", "cv_access", "candidate_screening", "employer_support", "annual_discount"], 'business_partial_yearly'),
('Recrutement Partiel 0-500 (Annuel)', 'Recrutement partiel pour entreprises de 0 à 500 salariés - Annuel', 1000000.00, 'FCFA', 'yearly', '["recruitment_partial", "job_posting", "cv_access", "candidate_screening", "employer_support", "annual_discount"], 'business_partial_yearly'),
('Recrutement Partiel 500+ (Annuel)', 'Recrutement partiel pour entreprises de 500+ salariés - Annuel', 1500000.00, 'FCFA', 'yearly', '["recruitment_partial", "job_posting", "cv_access", "candidate_screening", "employer_support", "priority_support", "annual_discount"], 'business_partial_yearly');

-- Abonnements entreprises - Recrutement en autonomie
INSERT INTO public.pricing_plans (name, description, price, currency, billing_cycle, features, category) VALUES
('Recrutement Autonomie (Mensuel)', 'Recrutement en autonomie avec accompagnement léger - Mensuel', 45000.00, 'FCFA', 'monthly', '["recruitment_autonomy", "job_posting", "cv_access", "light_support", "basic_consulting"], 'business_autonomy_monthly'),
('Recrutement Autonomie (Annuel)', 'Recrutement en autonomie avec accompagnement léger - Annuel', 500000.00, 'FCFA', 'yearly', '["recruitment_autonomy", "job_posting", "cv_access", "light_support", "basic_consulting", "annual_discount"], 'business_autonomy_yearly');

-- Services établissements scolaires & universitaires
INSERT INTO public.pricing_plans (name, description, price, currency, billing_cycle, features, category) VALUES
('Modules de cours', 'Modules de cours personnalisés pour établissements', 0.00, 'FCFA', 'one_time', '["custom_modules", "educational_content", "pedagogical_support", "progress_tracking", "quote_based"], 'education_modules'),
('Séance CV & Lettre de motivation', 'Séance sur CV & Lettre de motivation par classe', 100000.00, 'FCFA', 'one_time', '["cv_session", "motivation_letter_session", "class_training", "pedagogical_materials", "post_session_support"], 'education_session'),
('Accompagnement CDI/Contrat', 'Accompagnement jusqu\'à un premier CDI ou contrat', 0.00, 'FCFA', 'one_time', '["personalized_support", "individual_follow_up", "post_placement_support", "continuous_evaluation", "quote_based"], 'education_support');

-- Ajouter des plans de tarification par service pour les entreprises
INSERT INTO public.pricing_plans (name, description, price, currency, billing_cycle, features, category) VALUES
('Recrutement Complet par Service', 'Recrutement complet (de la publication à l\'intégration) - 15% du salaire brut annuel', 0.00, 'FCFA', 'one_time', '["recruitment_complete", "job_posting", "cv_access", "candidate_screening", "interview_coordination", "integration_support", "percentage_based"], 'business_service_complete'),
('Recrutement Partiel par Service', 'Recrutement à partir de l\'annonce sur notre site - 10% du salaire brut annuel', 0.00, 'FCFA', 'one_time', '["recruitment_partial", "job_posting", "cv_access", "candidate_screening", "employer_support", "percentage_based"], 'business_service_partial'),
('Recrutement Autonomie par Service', 'Recrutement en autonomie (accompagnement léger) - 5% du salaire brut annuel', 0.00, 'FCFA', 'one_time', '["recruitment_autonomy", "job_posting", "cv_access", "light_support", "percentage_based"], 'business_service_autonomy');

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_pricing_plans_category ON public.pricing_plans(category);
CREATE INDEX IF NOT EXISTS idx_pricing_plans_billing_cycle ON public.pricing_plans(billing_cycle);
CREATE INDEX IF NOT EXISTS idx_pricing_plans_currency ON public.pricing_plans(currency);
