const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const SUPABASE_URL = "https://pstbchulcfwcpngrsebj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzdGJjaHVsY2Z3Y3BuZ3JzZWJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NzEzNTcsImV4cCI6MjA2ODE0NzM1N30.hWw9wJazUjVmQ1OctM4fKITEoKG_tleBFbiZ0RtG5w0";

// Créer le client Supabase avec la clé anonyme
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminAccount() {
  try {
    console.log('🚀 Création du compte administrateur...');
    
    // 1. Créer l'utilisateur via l'inscription normale
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'admin@novrh.ml',
      password: 'Admin123!',
      options: {
        data: {
          first_name: 'Admin',
          last_name: 'NovRH',
          role: 'admin'
        }
      }
    });

    if (authError) {
      throw new Error(`Erreur lors de la création de l'utilisateur: ${authError.message}`);
    }

    console.log('✅ Utilisateur créé avec succès:', authData.user.id);

    // 2. Créer le profil dans la table profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: authData.user.id,
        email: 'admin@novrh.ml',
        first_name: 'Admin',
        last_name: 'NovRH',
        user_type: 'admin',
        is_active: true,
        email_verified: true
      })
      .select()
      .single();

    if (profileError) {
      throw new Error(`Erreur lors de la création du profil: ${profileError.message}`);
    }

    console.log('✅ Profil administrateur créé avec succès');

    // 3. Ajouter l'utilisateur à l'équipe d'administration par défaut
    const { data: teamData, error: teamError } = await supabase
      .from('team_members')
      .insert({
        team_id: '550e8400-e29b-41d4-a716-446655440031', // ID de l'équipe par défaut
        user_id: authData.user.id,
        role: 'owner',
        permissions: {
          users: ['read', 'write', 'delete'],
          companies: ['read', 'write', 'delete'],
          jobs: ['read', 'write', 'delete'],
          candidates: ['read', 'write', 'delete'],
          settings: ['read', 'write'],
          reports: ['read', 'write']
        },
        is_active: true
      })
      .select()
      .single();

    if (teamError) {
      console.warn('⚠️ Erreur lors de l\'ajout à l\'équipe (peut être déjà existant):', teamError.message);
    } else {
      console.log('✅ Utilisateur ajouté à l\'équipe d\'administration');
    }

    console.log('\n🎉 COMPTE ADMINISTRATEUR CRÉÉ AVEC SUCCÈS !');
    console.log('📧 Email:', 'admin@novrh.ml');
    console.log('🔑 Mot de passe:', 'Admin123!');
    console.log('🆔 ID utilisateur:', authData.user.id);
    console.log('👑 Rôle: Administrateur');
    console.log('\n🌐 Accès au dashboard: http://localhost:5173/admin');
    console.log('\n⚠️  IMPORTANT: Gardez ces informations en sécurité !');

  } catch (error) {
    console.error('❌ Erreur lors de la création du compte administrateur:', error.message);
    
    if (error.message.includes('duplicate key')) {
      console.log('\n💡 Solution: L\'utilisateur existe déjà. Essayez de vous connecter directement.');
    }
    
    console.log('\n🔧 Solutions alternatives:');
    console.log('1. Vérifiez que les migrations de base de données sont appliquées');
    console.log('2. Vérifiez que la table profiles existe et est accessible');
    console.log('3. Essayez de vous connecter avec admin@novrh.ml / Admin123!');
  }
}

// Exécuter le script
createAdminAccount();
