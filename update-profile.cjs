// Script pour mettre à jour le profil admin
const SUPABASE_URL = "https://pstbchulcfwcpngrsebj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzdGJjaHVsY2Z3Y3BuZ3JzZWJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NzEzNTcsImV4cCI6MjA2ODE0NzM1N30.hWw9wJazUjVmQ1OctM4fKITEoKG_tleBFbiZ0RtG5w0";

async function updateAdminProfile() {
  try {
    console.log('🔄 Mise à jour du profil admin...');
    
    const userId = '908524d2-cfb8-4043-8ac2-335a5a032701';
    
    // Supprimer l'ancien profil s'il existe
    const deleteResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles?user_id=eq.${userId}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      }
    });
    
    console.log('🧹 Ancien profil supprimé');
    
    // Créer le nouveau profil admin
    const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        user_id: userId,
        user_type: 'admin',
        is_active: true
      })
    });
    
    if (profileResponse.ok) {
      console.log('✅ Profil admin créé avec succès');
    } else {
      const profileError = await profileResponse.text();
      console.log('⚠️ Erreur création profil:', profileError);
    }
    
    // Vérifier le profil
    const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles?user_id=eq.${userId}`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    const profileData = await checkResponse.json();
    console.log('📋 Profil vérifié:', profileData);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

updateAdminProfile();
