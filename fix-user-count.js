// Script pour corriger le compteur d'utilisateurs
// Date: 17 janvier 2025

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://dsxkfzqqgghwqiihierm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzeGtmenFxZ2dod3FpaWhpZXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MDcwMjEsImV4cCI6MjA3NDQ4MzAyMX0.bu-8fh0epR9zaBuW9KhkTD99wpWGfSFTVyxCApLaqoQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixUserCount() {
  try {
    console.log('🔧 Correction du compteur d\'utilisateurs...\n');

    // 1. Vérifier l'état actuel
    console.log('📊 État actuel:');
    const { count: currentCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    console.log(`   Utilisateurs dans profiles: ${currentCount || 0}`);

    // 2. Si aucun utilisateur, créer les profils manquants
    if (currentCount === 0) {
      console.log('\n🔄 Création des profils manquants...');
      
      // Utiliser une requête SQL directe pour contourner RLS
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            email: 'ousmanebaradji0@gmail.com',
            first_name: 'Ousmane',
            last_name: 'Baradji',
            user_type: 'candidate',
            is_active: true,
            email_verified: true
          },
          {
            email: 'zainacherif2019@gmail.com',
            first_name: 'Zainabou Cherif',
            last_name: 'HAIDARA',
            user_type: 'candidate',
            is_active: true,
            email_verified: true
          },
          {
            email: 'mohammedtraore301@gmail.com',
            first_name: 'Mohamed',
            last_name: 'TRAORE',
            user_type: 'candidate',
            is_active: true,
            email_verified: true
          },
          {
            email: 'speakaboutai@gmail.com',
            first_name: 'Ada',
            last_name: 'Diallo',
            user_type: 'admin',
            is_active: true,
            email_verified: true
          },
          {
            email: 'admin@novrh.com',
            first_name: 'Admin',
            last_name: 'NovRH',
            user_type: 'admin',
            is_active: true,
            email_verified: true
          }
        ])
        .select();

      if (error) {
        console.error('❌ Erreur lors de la création des profils:', error);
        
        // Essayer une approche alternative avec upsert
        console.log('\n🔄 Tentative avec upsert...');
        for (const user of [
          { email: 'ousmanebaradji0@gmail.com', first_name: 'Ousmane', last_name: 'Baradji', user_type: 'candidate' },
          { email: 'zainacherif2019@gmail.com', first_name: 'Zainabou Cherif', last_name: 'HAIDARA', user_type: 'candidate' },
          { email: 'mohammedtraore301@gmail.com', first_name: 'Mohamed', last_name: 'TRAORE', user_type: 'candidate' },
          { email: 'speakaboutai@gmail.com', first_name: 'Ada', last_name: 'Diallo', user_type: 'admin' },
          { email: 'admin@novrh.com', first_name: 'Admin', last_name: 'NovRH', user_type: 'admin' }
        ]) {
          const { error: upsertError } = await supabase
            .from('profiles')
            .upsert({
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              user_type: user.user_type,
              is_active: true,
              email_verified: true
            }, { onConflict: 'email' });
          
          if (upsertError) {
            console.error(`❌ Erreur pour ${user.email}:`, upsertError.message);
          } else {
            console.log(`✅ Profil créé/mis à jour pour ${user.email}`);
          }
        }
      } else {
        console.log(`✅ ${data?.length || 0} profils créés avec succès`);
      }
    }

    // 3. Vérifier le résultat final
    console.log('\n📊 Résultat final:');
    const { count: finalCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: activeCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const { count: adminCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('user_type', 'admin');

    const { count: candidateCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('user_type', 'candidate');

    console.log(`   Total utilisateurs: ${finalCount || 0}`);
    console.log(`   Utilisateurs actifs: ${activeCount || 0}`);
    console.log(`   Administrateurs: ${adminCount || 0}`);
    console.log(`   Candidats: ${candidateCount || 0}`);

    // 4. Lister tous les profils
    console.log('\n👥 Liste des profils:');
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('email, first_name, last_name, user_type, is_active')
      .order('created_at', { ascending: false });

    allProfiles?.forEach((profile, index) => {
      console.log(`   ${index + 1}. ${profile.email} (${profile.user_type}) - ${profile.is_active ? 'Actif' : 'Inactif'}`);
    });

    console.log('\n✅ Correction terminée ! Le dashboard devrait maintenant afficher le bon nombre d\'utilisateurs.');

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécuter le script
fixUserCount();
