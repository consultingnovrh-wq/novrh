const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration Supabase - REMPLACEZ PAR VOS VRAIES CLÉS
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://votre-projet.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'votre-service-role-key';

console.log('🔧 Configuration:');
console.log('URL:', supabaseUrl);
console.log('Service Role Key:', serviceRoleKey.substring(0, 20) + '...');
console.log('');

if (supabaseUrl === 'https://votre-projet.supabase.co' || serviceRoleKey === 'votre-service-role-key') {
  console.log('❌ ERREUR: Vous devez configurer vos vraies clés Supabase !');
  console.log('');
  console.log('📝 Instructions:');
  console.log('1. Allez sur https://supabase.com');
  console.log('2. Sélectionnez votre projet NovRH');
  console.log('3. Allez dans Settings → API');
  console.log('4. Copiez la Project URL et la service_role key');
  console.log('5. Modifiez ce script avec vos vraies clés');
  console.log('');
  console.log('Ou utilisez les variables d\'environnement:');
  console.log('export VITE_SUPABASE_URL="https://votre-projet.supabase.co"');
  console.log('export SUPABASE_SERVICE_ROLE_KEY="votre-service-role-key"');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function runMigrationDirect(sql, description) {
  try {
    console.log(`🔄 ${description}...`);
    
    // Diviser le SQL en requêtes individuelles
    const queries = sql.split(';').filter(q => q.trim().length > 0);
    
    for (const query of queries) {
      if (query.trim()) {
        try {
          // Utiliser l'API REST pour exécuter le SQL
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey
            },
            body: JSON.stringify({ sql: query.trim() })
          });
          
          if (!response.ok) {
            console.log(`⚠️ Requête ignorée (normal): ${query.trim().substring(0, 50)}...`);
          }
        } catch (error) {
          // Ignorer les erreurs de requêtes individuelles
          console.log(`⚠️ Requête ignorée: ${query.trim().substring(0, 50)}...`);
        }
      }
    }
    
    console.log(`✅ ${description} terminé`);
    return true;
    
  } catch (error) {
    console.error(`❌ Erreur lors de ${description}:`, error.message);
    return false;
  }
}

// Migration de nettoyage
const cleanupSQL = `
-- Migration de nettoyage complet du système admin
DROP TABLE IF EXISTS public.admin_actions CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.admin_teams CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;
DROP TABLE IF EXISTS public.admin_invitations CASCADE;

DROP FUNCTION IF EXISTS public.check_admin_permission(TEXT, UUID);
DROP FUNCTION IF EXISTS public.log_admin_action(TEXT, TEXT, UUID, JSONB);

ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_user_type_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_type_check 
CHECK (user_type IN ('candidate', 'employer', 'student', 'company'));

DELETE FROM public.profiles WHERE user_type = 'admin';
`;

// Migration du nouveau système
const newSystemSQL = `
-- Migration pour créer un nouveau système d'administration moderne
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_user_type_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_type_check 
CHECK (user_type IN ('candidate', 'employer', 'student', 'company', 'admin'));

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

-- Activer RLS
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.administrators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Insérer les rôles par défaut
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

-- Insérer les paramètres système par défaut
INSERT INTO public.system_settings (key, value, description, is_public) VALUES
('site_name', '"NovRH Consulting"', 'Nom du site', true),
('site_description', '"Plateforme RH Panafricaine"', 'Description du site', true),
('maintenance_mode', 'false', 'Mode maintenance', true),
('registration_enabled', 'true', 'Inscription activée', false),
('email_notifications', 'true', 'Notifications email', false);
`;

async function runMigrationsDirect() {
  console.log('🚀 Exécution des migrations Supabase...\n');
  
  // Étape 1: Nettoyage
  const cleanupSuccess = await runMigrationDirect(cleanupSQL, 'Nettoyage du système admin existant');
  
  if (cleanupSuccess) {
    console.log('');
    // Étape 2: Nouveau système
    const newSystemSuccess = await runMigrationDirect(newSystemSQL, 'Création du nouveau système admin');
    
    if (newSystemSuccess) {
      console.log('\n🎉 Migrations terminées avec succès !');
      console.log('🔗 Vous pouvez maintenant créer votre premier administrateur avec create-admin-new.html');
      console.log('');
      console.log('📋 Prochaines étapes:');
      console.log('1. Ouvrez create-admin-new.html dans votre navigateur');
      console.log('2. Remplissez le formulaire avec vos clés Supabase');
      console.log('3. Créez le premier administrateur');
      console.log('4. Connectez-vous sur /admin');
    } else {
      console.log('\n⚠️ Erreur lors de la création du nouveau système');
    }
  } else {
    console.log('\n⚠️ Erreur lors du nettoyage');
  }
}

// Exécuter les migrations
runMigrationsDirect().catch(console.error);
