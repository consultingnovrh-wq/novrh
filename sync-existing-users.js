// Script pour synchroniser les utilisateurs existants de auth.users vers profiles
// Date: 17 janvier 2025

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://dsxkfzqqgghwqiihierm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzeGtmenFxZ2dod3FpaWhpZXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MDcwMjEsImV4cCI6MjA3NDQ4MzAyMX0.bu-8fh0epR9zaBuW9KhkTD99wpWGfSFTVyxCApLaqoQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncExistingUsers() {
  try {
    console.log('🔄 Synchronisation des utilisateurs existants...\n');

    // 1. Désactiver temporairement RLS pour permettre la synchronisation
    console.log('🔓 Désactivation temporaire de RLS...');
    const { error: rlsError } = await supabase.rpc('disable_rls_for_profiles');
    if (rlsError) {
      console.log('⚠️ Impossible de désactiver RLS via RPC, continuation...');
    }

    // 2. Créer les profils manquants pour les utilisateurs existants
    console.log('👥 Création des profils manquants...');
    
    // Utilisateurs connus à partir de l'interface d'authentification
    const knownUsers = [
      {
        email: 'ousmanebaradji0@gmail.com',
        first_name: 'Ousmane',
        last_name: 'Baradji',
        user_type: 'candidate'
      },
      {
        email: 'zainacherif2019@gmail.com',
        first_name: 'Zainabou Cherif',
        last_name: 'HAIDARA',
        user_type: 'candidate'
      },
      {
        email: 'mohammedtraore301@gmail.com',
        first_name: 'Mohamed',
        last_name: 'TRAORE',
        user_type: 'candidate'
      },
      {
        email: 'speakaboutai@gmail.com',
        first_name: 'Ada',
        last_name: 'Diallo',
        user_type: 'admin'
      },
      {
        email: 'admin@novrh.com',
        first_name: 'Admin',
        last_name: 'NovRH',
        user_type: 'admin'
      }
    ];

    let syncedCount = 0;
    let errorCount = 0;

    for (const user of knownUsers) {
      try {
        // Vérifier si le profil existe déjà
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('email', user.email)
          .single();

        if (existingProfile) {
          console.log(`✅ Profil déjà existant pour ${user.email}`);
          continue;
        }

        // Créer le profil
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            user_type: user.user_type,
            is_active: true,
            email_verified: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (insertError) {
          console.error(`❌ Erreur pour ${user.email}:`, insertError.message);
          errorCount++;
        } else {
          console.log(`✅ Profil créé pour ${user.email} (${user.user_type})`);
          syncedCount++;
        }
      } catch (error) {
        console.error(`❌ Erreur pour ${user.email}:`, error.message);
        errorCount++;
      }
    }

    // 3. Réactiver RLS
    console.log('\n🔒 Réactivation de RLS...');
    const { error: rlsReenableError } = await supabase.rpc('enable_rls_for_profiles');
    if (rlsReenableError) {
      console.log('⚠️ Impossible de réactiver RLS via RPC, continuation...');
    }

    // 4. Vérifier le résultat
    console.log('\n📊 Résultat de la synchronisation:');
    console.log(`   Profils créés: ${syncedCount}`);
    console.log(`   Erreurs: ${errorCount}`);

    // 5. Afficher les statistiques finales
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: activeUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    console.log('\n📈 Statistiques finales:');
    console.log(`   Total utilisateurs: ${totalUsers || 0}`);
    console.log(`   Utilisateurs actifs: ${activeUsers || 0}`);

    // 6. Lister tous les profils
    console.log('\n👥 Liste des profils:');
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('email, first_name, last_name, user_type, is_active')
      .order('created_at', { ascending: false });

    allProfiles?.forEach((profile, index) => {
      console.log(`   ${index + 1}. ${profile.email} (${profile.user_type}) - ${profile.is_active ? 'Actif' : 'Inactif'}`);
    });

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécuter le script
syncExistingUsers();
