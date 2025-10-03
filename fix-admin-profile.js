// Script pour corriger le profil admin
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://dsxkfzqqgghwqiihierm.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzeGtmenFxZ2dod3FpaWhpZXJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODkwNzAyMSwiZXhwIjoyMDc0NDgzMDIxfQ.uPw8Jjnaj6QI25wlwQt9C0wPHj90W0nPcUNOvthC-RY";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function fixAdminProfile() {
  try {
    console.log('🔧 Correction du profil admin...\n');
    
    const adminUserId = '646e81ca-b467-41c3-a376-ab57347131d9';
    
    // 1. Mettre à jour le profil pour le rendre admin
    console.log('📝 Mise à jour du profil...');
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({ 
        user_type: 'admin',
        is_active: true,
        email_verified: true
      })
      .eq('user_id', adminUserId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Erreur lors de la mise à jour du profil:', updateError);
      return;
    }
    
    console.log('✅ Profil mis à jour:', updatedProfile.email);
    console.log(`   Type: ${updatedProfile.user_type}`);
    console.log(`   Actif: ${updatedProfile.is_active}`);
    console.log(`   Email vérifié: ${updatedProfile.email_verified}`);
    
    // 2. Vérifier l'entrée dans la table administrators
    console.log('\n🔍 Vérification de l\'entrée administrateur...');
    const { data: adminEntry, error: adminError } = await supabase
      .from('administrators')
      .select(`
        *,
        admin_roles(name)
      `)
      .eq('user_id', adminUserId)
      .single();

    if (adminError) {
      console.error('❌ Erreur lors de la récupération de l\'entrée admin:', adminError);
    } else {
      console.log('✅ Entrée administrateur trouvée:');
      console.log(`   Rôle: ${adminEntry.admin_roles?.name}`);
      console.log(`   Actif: ${adminEntry.is_active}`);
    }
    
    // 3. Test de connexion
    console.log('\n🧪 Test de connexion...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@novrh.com',
      password: 'admin123456'
    });

    if (authError) {
      console.error('❌ Erreur de connexion:', authError);
    } else {
      console.log('✅ Connexion réussie!');
      console.log(`   Utilisateur: ${authData.user.email}`);
      console.log(`   ID: ${authData.user.id}`);
      
      // Vérifier le profil après connexion
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type, is_active')
        .eq('user_id', authData.user.id)
        .single();
        
      if (profileError) {
        console.error('❌ Erreur lors de la récupération du profil:', profileError);
      } else {
        console.log(`   Profil: ${profile.user_type} (actif: ${profile.is_active})`);
      }
    }
    
    console.log('\n🎉 CORRECTION TERMINÉE !');
    console.log('📧 Email: admin@novrh.com');
    console.log('🔑 Mot de passe: admin123456');
    console.log('🌐 Accès: http://localhost:8081/admin');
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
  }
}

// Exécuter le script
fixAdminProfile();