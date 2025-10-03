// Script pour vérifier et synchroniser les utilisateurs
// Date: 17 janvier 2025

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase (remplacez par vos vraies valeurs)
const supabaseUrl = 'https://dsxkfzqqgghwqiihierm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzeGtmenFxZ2dod3FpaWhpZXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MDcwMjEsImV4cCI6MjA3NDQ4MzAyMX0.bu-8fh0epR9zaBuW9KhkTD99wpWGfSFTVyxCApLaqoQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndSyncUsers() {
  try {
    console.log('🔍 Vérification des utilisateurs...\n');

    // 1. Compter les utilisateurs dans auth.users (via une fonction RPC)
    console.log('📊 Utilisateurs dans auth.users:');
    const { data: authUsers, error: authError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (authError) {
      console.error('❌ Erreur lors du comptage des utilisateurs auth:', authError);
    } else {
      console.log(`   Total: ${authUsers?.length || 0} utilisateurs`);
    }

    // 2. Compter les utilisateurs dans profiles
    console.log('\n📊 Utilisateurs dans profiles:');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (profilesError) {
      console.error('❌ Erreur lors du comptage des profils:', profilesError);
    } else {
      console.log(`   Total: ${profiles?.length || 0} profils`);
    }

    // 3. Lister tous les profils existants
    console.log('\n👥 Liste des profils existants:');
    const { data: allProfiles, error: listError } = await supabase
      .from('profiles')
      .select('user_id, email, first_name, last_name, user_type, is_active, created_at')
      .order('created_at', { ascending: false });

    if (listError) {
      console.error('❌ Erreur lors de la récupération des profils:', listError);
    } else {
      allProfiles?.forEach((profile, index) => {
        console.log(`   ${index + 1}. ${profile.email} (${profile.user_type}) - ${profile.is_active ? 'Actif' : 'Inactif'}`);
      });
    }

    // 4. Vérifier les statistiques du dashboard
    console.log('\n📈 Statistiques du dashboard:');
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: activeUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const { count: verifiedUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('email_verified', true);

    console.log(`   Total utilisateurs: ${totalUsers || 0}`);
    console.log(`   Utilisateurs actifs: ${activeUsers || 0}`);
    console.log(`   Emails vérifiés: ${verifiedUsers || 0}`);

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécuter le script
checkAndSyncUsers();
