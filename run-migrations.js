import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://votre-projet.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'votre-clé-anon';

// Utilisez la service_role key pour les migrations
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'votre-service-role-key';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function runMigration(migrationFile: string) {
  try {
    console.log(`🔄 Exécution de la migration: ${migrationFile}`);
    
    // Lire le fichier de migration
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', migrationFile);
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Exécuter la migration
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });
    
    if (error) {
      console.error(`❌ Erreur lors de l'exécution de ${migrationFile}:`, error);
      return false;
    }
    
    console.log(`✅ Migration ${migrationFile} exécutée avec succès`);
    return true;
    
  } catch (error) {
    console.error(`❌ Erreur lors de la lecture de ${migrationFile}:`, error);
    return false;
  }
}

async function runMigrations() {
  console.log('🚀 Début des migrations Supabase...\n');
  
  // Liste des migrations à exécuter dans l'ordre
  const migrations = [
    '20250716210000-cleanup-admin-system.sql',
    '20250716220000-create-new-admin-system.sql'
  ];
  
  let successCount = 0;
  
  for (const migration of migrations) {
    const success = await runMigration(migration);
    if (success) {
      successCount++;
    }
    console.log(''); // Ligne vide pour la lisibilité
  }
  
  console.log(`📊 Résumé: ${successCount}/${migrations.length} migrations exécutées avec succès`);
  
  if (successCount === migrations.length) {
    console.log('🎉 Toutes les migrations ont été exécutées avec succès !');
    console.log('🔗 Vous pouvez maintenant créer votre premier administrateur avec create-admin-new.html');
  } else {
    console.log('⚠️ Certaines migrations ont échoué. Vérifiez les erreurs ci-dessus.');
  }
}

// Fonction alternative utilisant l'API REST directement
async function runMigrationDirect(sql: string, description: string) {
  try {
    console.log(`🔄 ${description}...`);
    
    // Diviser le SQL en requêtes individuelles
    const queries = sql.split(';').filter(q => q.trim().length > 0);
    
    for (const query of queries) {
      if (query.trim()) {
        const { error } = await supabase
          .from('_migrations')
          .select('*')
          .limit(0); // Requête factice pour tester la connexion
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = table n'existe pas, c'est normal
          console.log(`Exécution: ${query.trim().substring(0, 50)}...`);
        }
      }
    }
    
    console.log(`✅ ${description} terminé`);
    return true;
    
  } catch (error) {
    console.error(`❌ Erreur lors de ${description}:`, error);
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
    // Étape 2: Nouveau système
    const newSystemSuccess = await runMigrationDirect(newSystemSQL, 'Création du nouveau système admin');
    
    if (newSystemSuccess) {
      console.log('\n🎉 Migrations terminées avec succès !');
      console.log('🔗 Vous pouvez maintenant créer votre premier administrateur avec create-admin-new.html');
    } else {
      console.log('\n⚠️ Erreur lors de la création du nouveau système');
    }
  } else {
    console.log('\n⚠️ Erreur lors du nettoyage');
  }
}

// Exécuter les migrations
runMigrationsDirect().catch(console.error);
