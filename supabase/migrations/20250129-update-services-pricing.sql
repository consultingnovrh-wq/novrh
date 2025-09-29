-- Migration pour ajouter les nouveaux services de tarification
-- Date: 2025-01-29

-- Ajouter les nouveaux services pour entreprises

-- Service d'Audit RH & organisationnel
INSERT INTO public.pricing_plans (name, description, price, currency, billing_cycle, features, category) VALUES
('Audit RH & Organisationnel', 'Diagnostic complet des dysfonctionnements RH, juridiques et santé au travail', 0.00, 'FCFA', 'one_time', '["audit_rh", "questionnaire_collaborateurs", "observation_site", "analyse_procedures", "etude_documentaire", "diagnostic_global", "proposition_actions", "suivi_mise_oeuvre", "quote_based"], 'audit_rh');

-- Services de Formations Professionnelles pour Entreprises
INSERT INTO public.pricing_plans (name, description, price, currency, billing_cycle, features, category) VALUES
('Formation - Recrutement efficace et sans biais', 'Formation sur les techniques de recrutement efficaces et la prévention des biais', 0.00, 'FCFA', 'one_time', '["formation_recrutement", "techniques_recrutement", "prevention_biais", "presentiel_distance", "quote_based"], 'formation_entreprise'),
('Formation - Règles SST et obligations légales', 'Formation sur la sécurité et santé au travail et les obligations légales', 0.00, 'FCFA', 'one_time', '["formation_sst", "obligations_legales", "securite_travail", "presentiel_distance", "quote_based"], 'formation_entreprise'),
('Formation - Dialogue social et droit du travail', 'Formation sur le dialogue social et les aspects juridiques du travail', 0.00, 'FCFA', 'one_time', '["formation_dialogue_social", "droit_travail", "relations_sociales", "presentiel_distance", "quote_based"], 'formation_entreprise'),
('Formation - Leadership et communication', 'Formation sur le leadership, communication interne et gestion du stress', 0.00, 'FCFA', 'one_time', '["formation_leadership", "communication_interne", "gestion_stress", "presentiel_distance", "quote_based"], 'formation_entreprise'),
('Formation - Prévention des risques professionnels', 'Formation sur la prévention et gestion des risques professionnels', 0.00, 'FCFA', 'one_time', '["formation_risques", "prevention_risques", "gestion_risques", "presentiel_distance", "quote_based"], 'formation_entreprise'),
('Formation - Gestion de conflits et motivation', 'Formation sur la gestion des conflits et la motivation des équipes', 0.00, 'FCFA', 'one_time', '["formation_conflits", "gestion_conflits", "motivation_equipes", "presentiel_distance", "quote_based"], 'formation_entreprise'),
('Formation - Guide file/Serre file', 'Formation théorique et pratique sur les techniques de guide file/serre file', 0.00, 'FCFA', 'one_time', '["formation_guide_file", "formation_serre_file", "formation_theorique", "formation_pratique", "presentiel_distance", "quote_based"], 'formation_entreprise');

-- Services pour Étudiants
INSERT INTO public.pricing_plans (name, description, price, currency, billing_cycle, features, category) VALUES
('Définir un projet professionnel', 'Accompagnement pour définir un projet professionnel réaliste et réalisable', 0.00, 'FCFA', 'one_time', '["projet_professionnel", "orientation_carriere", "planification_carriere", "accompagnement_personnalise", "quote_based"], 'service_etudiant'),
('Apprendre à chercher un emploi', 'Formation sur les techniques de recherche d\'emploi efficaces', 0.00, 'FCFA', 'one_time', '["recherche_emploi", "techniques_recherche", "strategies_candidature", "accompagnement_personnalise", "quote_based"], 'service_etudiant'),
('Créer un réseau professionnel', 'Formation et accompagnement pour développer un réseau professionnel', 0.00, 'FCFA', 'one_time', '["reseau_professionnel", "networking", "developpement_reseau", "strategies_networking", "accompagnement_personnalise", "quote_based"], 'service_etudiant'),
('Trouver des financements', 'Accompagnement pour identifier et obtenir des financements et subventions', 0.00, 'FCFA', 'one_time', '["financements", "subventions", "aides_projets", "accompagnement_demarches", "accompagnement_personnalise", "quote_based"], 'service_etudiant'),
('Développer une posture professionnelle', 'Formation sur le développement d\'une posture professionnelle adaptée', 0.00, 'FCFA', 'one_time', '["posture_professionnelle", "developpement_personnel", "competences_soft_skills", "accompagnement_personnalise", "quote_based"], 'service_etudiant');

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_pricing_plans_category_services ON public.pricing_plans(category);
CREATE INDEX IF NOT EXISTS idx_pricing_plans_quote_based ON public.pricing_plans USING GIN (features) WHERE features ? 'quote_based';
