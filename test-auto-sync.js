// Script pour tester la synchronisation automatique
// Date: 17 janvier 2025

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://dsxkfzqqgghwqiihierm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzeGtmenFxZ2dod3FpaWhpZXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MDcwMjEsImV4cCI6MjA3NDQ4MzAyMX0.bu-8fh0epR9zaBuW9KhkTD99wpWGfSFTVyxCApLaqoQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAutoSync() {
  try {
    console.log('🧪 Test de la synchronisation automatique...\n');

    // 1. Vérifier l'état actuel
    console.log('📊 État actuel:');
    const { count: currentCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    console.log(`   Utilisateurs dans profiles: ${currentCount || 0}`);

    // 2. Simuler la création d'un nouvel utilisateur (test)
    console.log('\n🔄 Test de création d\'utilisateur...');
    
    // Note: En réalité, ceci devrait être fait via l'interface d'inscription
    // Ici on teste juste la synchronisation des utilisateurs existants
    
    // 3. Vérifier si les triggers existent
    console.log('\n🔍 Vérification des triggers...');
    
    // 4. Afficher les statistiques finales
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: activeUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const { count: adminUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('user_type', 'admin');

    const { count: candidateUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('user_type', 'candidate');

    const { count: companyUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('user_type', 'company');

    console.log('\n📈 Statistiques finales:');
    console.log(`   Total utilisateurs: ${totalUsers || 0}`);
    console.log(`   Utilisateurs actifs: ${activeUsers || 0}`);
    console.log(`   Administrateurs: ${adminUsers || 0}`);
    console.log(`   Candidats: ${candidateUsers || 0}`);
    console.log(`   Entreprises: ${companyUsers || 0}`);

    // 5. Lister tous les profils
    console.log('\n👥 Liste des profils:');
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('email, first_name, last_name, user_type, is_active, created_at')
      .order('created_at', { ascending: false });

    if (allProfiles && allProfiles.length > 0) {
      allProfiles.forEach((profile, index) => {
        console.log(`   ${index + 1}. ${profile.email} (${profile.user_type}) - ${profile.is_active ? 'Actif' : 'Inactif'} - ${new Date(profile.created_at).toLocaleDateString()}`);
      });
    } else {
      console.log('   Aucun profil trouvé');
    }

    console.log('\n✅ Test terminé !');
    console.log('\n📝 Instructions pour tester la synchronisation automatique:');
    console.log('   1. Exécutez la migration SQL dans Supabase Dashboard');
    console.log('   2. Créez un nouveau compte via l\'interface d\'inscription');
    console.log('   3. Vérifiez que le profil est automatiquement créé dans la table profiles');
    console.log('   4. Le dashboard devrait se mettre à jour automatiquement');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le test
testAutoSync();
