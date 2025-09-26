// Script de diagnostic pour l'inscription
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const SUPABASE_URL = "https://pstbchulcfwcpngrsebj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzdGJjaHVsY2Z3Y3BuZ3JzZWJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NzEzNTcsImV4cCI6MjA2ODE0NzM1N30.hWw9wJazUjVmQ1OctM4fKITEoKG_tleBFbiZ0RtG5w0";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testRegistration() {
  console.log('🔍 Test de diagnostic de l\'inscription...\n');

  try {
    // Test 1: Vérifier la connexion à Supabase
    console.log('1️⃣ Test de connexion à Supabase...');
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Erreur de connexion:', testError);
      return;
    }
    console.log('✅ Connexion réussie\n');

    // Test 2: Vérifier les politiques RLS
    console.log('2️⃣ Test des politiques RLS...');
    const { data: policies, error: policiesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (policiesError) {
      console.error('❌ Erreur RLS:', policiesError);
      console.log('💡 Solution: Appliquer la migration RLS dans Supabase Studio');
      return;
    }
    console.log('✅ Politiques RLS OK\n');

    // Test 3: Tenter l'inscription
    console.log('3️⃣ Test d\'inscription...');
    const testEmail = `test-${Date.now()}@example.com`;
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'Test123!',
      options: {
        data: {
          first_name: 'Test',
          last_name: 'User',
          phone: '+1234567890'
        }
      }
    });

    if (authError) {
      console.error('❌ Erreur d\'inscription:', authError);
      console.log('💡 Détails de l\'erreur:', authError.message);
      return;
    }

    console.log('✅ Inscription réussie:', authData.user.id);

    // Test 4: Créer le profil
    console.log('4️⃣ Test de création de profil...');
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        user_id: authData.user.id,
        email: testEmail,
        first_name: 'Test',
        last_name: 'User',
        user_type: 'candidate',
        is_active: true,
        email_verified: false
      }]);

    if (profileError) {
      console.error('❌ Erreur profil:', profileError);
      console.log('💡 Détails de l\'erreur:', profileError.message);
      return;
    }

    console.log('✅ Profil créé avec succès\n');

    // Test 5: Créer le profil candidat
    console.log('5️⃣ Test de création de profil candidat...');
    const { error: candidateError } = await supabase
      .from('candidates')
      .insert([{
        user_id: authData.user.id,
        first_name: 'Test',
        last_name: 'User',
        phone: '+1234567890',
        profile_description: 'Test profile'
      }]);

    if (candidateError) {
      console.error('❌ Erreur candidat:', candidateError);
      console.log('💡 Détails de l\'erreur:', candidateError.message);
      return;
    }

    console.log('✅ Profil candidat créé avec succès\n');

    console.log('🎉 Tous les tests sont passés ! L\'inscription fonctionne correctement.');

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécuter le test
testRegistration();
