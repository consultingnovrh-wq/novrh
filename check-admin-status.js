// Script pour vérifier l'état du compte admin
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://dsxkfzqqgghwqiihierm.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzeGtmenFxZ2dod3FpaWhpZXJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODkwNzAyMSwiZXhwIjoyMDc0NDgzMDIxfQ.uPw8Jjnaj6QI25wlwQt9C0wPHj90W0nPcUNOvthC-RY";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkAdminStatus() {
  try {
    console.log('🔍 Vérification de l\'état du compte admin...\n');
    
    // 1. Vérifier l'utilisateur dans auth.users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Erreur lors de la récupération des utilisateurs:', usersError);
      return;
    }
    
    console.log('📊 Utilisateurs dans auth.users:');
    users.users.forEach(user => {
      console.log(`  - ${user.email} (ID: ${user.id})`);
      console.log(`    Créé: ${user.created_at}`);
      console.log(`    Email confirmé: ${user.email_confirmed_at ? 'Oui' : 'Non'}`);
      console.log(`    Actif: ${user.banned_until ? 'Non' : 'Oui'}`);
      console.log('');
    });
    
    // 2. Vérifier les profils
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error('❌ Erreur lors de la récupération des profils:', profilesError);
    } else {
      console.log('📊 Profils dans la table profiles:');
      profiles.forEach(profile => {
        console.log(`  - ${profile.email} (ID: ${profile.user_id})`);
        console.log(`    Type: ${profile.user_type}`);
        console.log(`    Actif: ${profile.is_active}`);
        console.log(`    Email vérifié: ${profile.email_verified}`);
        console.log('');
      });
    }
    
    // 3. Vérifier les rôles admin
    const { data: roles, error: rolesError } = await supabase
      .from('admin_roles')
      .select('*');
    
    if (rolesError) {
      console.error('❌ Erreur lors de la récupération des rôles:', rolesError);
    } else {
      console.log('📊 Rôles admin disponibles:');
      roles.forEach(role => {
        console.log(`  - ${role.name} (ID: ${role.id})`);
        console.log(`    Description: ${role.description}`);
        console.log('');
      });
    }
    
    // 4. Vérifier les administrateurs
    const { data: admins, error: adminsError } = await supabase
      .from('administrators')
      .select(`
        *,
        admin_roles(name),
        profiles(email, user_type)
      `);
    
    if (adminsError) {
      console.error('❌ Erreur lors de la récupération des administrateurs:', adminsError);
    } else {
      console.log('📊 Administrateurs:');
      admins.forEach(admin => {
        console.log(`  - ${admin.profiles?.email} (ID: ${admin.user_id})`);
        console.log(`    Rôle: ${admin.admin_roles?.name}`);
        console.log(`    Actif: ${admin.is_active}`);
        console.log('');
      });
    }
    
    // 5. Vérifier spécifiquement admin@novrh.com
    const adminUser = users.users.find(u => u.email === 'admin@novrh.com');
    if (adminUser) {
      console.log('🎯 Analyse du compte admin@novrh.com:');
      console.log(`  ID: ${adminUser.id}`);
      console.log(`  Email confirmé: ${adminUser.email_confirmed_at ? 'Oui' : 'Non'}`);
      console.log(`  Banni: ${adminUser.banned_until ? 'Oui' : 'Non'}`);
      console.log(`  Dernière connexion: ${adminUser.last_sign_in_at || 'Jamais'}`);
      
      const adminProfile = profiles?.find(p => p.user_id === adminUser.id);
      if (adminProfile) {
        console.log(`  Profil: ${adminProfile.user_type} (actif: ${adminProfile.is_active})`);
      } else {
        console.log('  ❌ Profil manquant dans la table profiles');
      }
      
      const adminEntry = admins?.find(a => a.user_id === adminUser.id);
      if (adminEntry) {
        console.log(`  Entrée admin: ${adminEntry.admin_roles?.name} (actif: ${adminEntry.is_active})`);
      } else {
        console.log('  ❌ Entrée manquante dans la table administrators');
      }
    } else {
      console.log('❌ Compte admin@novrh.com non trouvé dans auth.users');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  }
}

// Exécuter le script
checkAdminStatus();
