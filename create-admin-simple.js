// Script pour créer un super admin
const SUPABASE_URL = "https://pstbchulcfwcpngrsebj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzdGJjaHVsY2Z3Y3BuZ3JzZWJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NzEzNTcsImV4cCI6MjA2ODE0NzM1N30.hWw9wJazUjVmQ1OctM4fKITEoKG_tleBFbiZ0RtG5w0";

async function createSuperAdmin() {
  try {
    console.log('🚀 Création du super administrateur...');
    
    // 1. Créer l'utilisateur
    const signUpResponse = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        email: 'superadmin@novrh.ml',
        password: 'SuperAdmin123!',
        data: {
          first_name: 'Super',
          last_name: 'Admin',
          role: 'super_admin'
        }
      })
    });

    const signUpData = await signUpResponse.json();
    
    if (signUpData.error) {
      throw new Error(`Erreur création utilisateur: ${signUpData.error.message}`);
    }

    console.log('✅ Utilisateur créé:', signUpData.user.id);

    // 2. Créer le profil
    const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        user_id: signUpData.user.id,
        email: 'superadmin@novrh.ml',
        first_name: 'Super',
        last_name: 'Admin',
        user_type: 'admin',
        is_active: true,
        email_verified: true
      })
    });

    const profileData = await profileResponse.json();
    
    if (profileData.error) {
      throw new Error(`Erreur création profil: ${profileData.error.message}`);
    }

    console.log('✅ Profil créé avec succès');

    console.log('\n🎉 SUPER ADMIN CRÉÉ AVEC SUCCÈS !');
    console.log('📧 Email: superadmin@novrh.ml');
    console.log('🔑 Mot de passe: SuperAdmin123!');
    console.log('🆔 ID: ' + signUpData.user.id);
    console.log('\n🌐 Accès: http://localhost:5173/admin');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    
    if (error.message.includes('duplicate')) {
      console.log('\n💡 Le compte existe déjà. Connectez-vous avec:');
      console.log('📧 Email: superadmin@novrh.ml');
      console.log('🔑 Mot de passe: SuperAdmin123!');
    }
  }
}

createSuperAdmin();
