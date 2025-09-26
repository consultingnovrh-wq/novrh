// Script de diagnostic pour le problème d'accès admin
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://dsxkfzqqgghwqiihierm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzeGtmenFxZ2dod3FpaWhpZXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MDcwMjEsImV4cCI6MjA3NDQ4MzAyMX0.bu-8fh0epR9zaBuW9KhkTD99wpWGfSFTVyxCApLaqoQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function debugAdmin() {
  try {
    console.log('🔍 Diagnostic du problème d\'accès admin...');
    
    // 1. Vérifier l'utilisateur connecté
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ Erreur lors de la récupération de l\'utilisateur:', userError);
      return;
    }
    
    if (!user) {
      console.log('❌ Aucun utilisateur connecté');
      console.log('💡 Solution: Connectez-vous d\'abord avec admin@novrh.com');
      return;
    }
    
    console.log('✅ Utilisateur connecté:', user.email);
    console.log('🆔 User ID:', user.id);
    
    // 2. Vérifier le profil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Erreur lors de la récupération du profil:', profileError);
      return;
    }
    
    if (!profile) {
      console.log('❌ Aucun profil trouvé pour cet utilisateur');
      return;
    }
    
    console.log('✅ Profil trouvé:');
    console.log('   - Email:', profile.email);
    console.log('   - Type:', profile.user_type);
    console.log('   - Actif:', profile.is_active);
    console.log('   - Email vérifié:', profile.email_verified);
    
    // 3. Vérifier si c'est un admin
    if (profile.user_type !== 'admin') {
      console.log('❌ L\'utilisateur n\'est pas de type admin');
      console.log('💡 Solution: Mettez à jour le profil pour le rendre admin');
      return;
    }
    
    // 4. Vérifier la table administrators
    const { data: admin, error: adminError } = await supabase
      .from('administrators')
      .select(`
        *,
        role:admin_roles(*)
      `)
      .eq('user_id', user.id)
      .single();
    
    if (adminError) {
      console.error('❌ Erreur lors de la récupération de l\'administrateur:', adminError);
      return;
    }
    
    if (!admin) {
      console.log('❌ Aucun administrateur trouvé pour cet utilisateur');
      console.log('💡 Solution: Créez une entrée dans la table administrators');
      return;
    }
    
    console.log('✅ Administrateur trouvé:');
    console.log('   - Admin ID:', admin.id);
    console.log('   - Actif:', admin.is_active);
    console.log('   - Rôle:', admin.role?.display_name);
    console.log('   - Permissions:', admin.role?.permissions);
    
    // 5. Test de la fonction checkIsAdmin
    console.log('\n🧪 Test de la fonction checkIsAdmin...');
    
    // Simuler la logique du hook
    const { data: profileCheck } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('user_id', user.id)
      .single();
    
    if (!profileCheck || profileCheck.user_type !== 'admin') {
      console.log('❌ checkIsAdmin retournerait false (profil)');
      return;
    }
    
    const { data: adminCheck } = await supabase
      .from('administrators')
      .select('id, is_active')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();
    
    if (!adminCheck) {
      console.log('❌ checkIsAdmin retournerait false (administrateur)');
      return;
    }
    
    console.log('✅ checkIsAdmin retournerait true');
    console.log('\n🎉 Tout semble correct ! Le problème pourrait être:');
    console.log('   1. Cache du navigateur');
    console.log('   2. Session expirée');
    console.log('   3. Problème de RLS (Row Level Security)');
    console.log('   4. Erreur JavaScript dans la console');
    
    // 6. Vérifier les politiques RLS
    console.log('\n🔒 Vérification des politiques RLS...');
    
    const { data: rlsTest, error: rlsError } = await supabase
      .from('administrators')
      .select('id')
      .eq('user_id', user.id);
    
    if (rlsError) {
      console.error('❌ Erreur RLS:', rlsError);
    } else {
      console.log('✅ RLS OK - Accès autorisé à la table administrators');
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécuter le diagnostic
debugAdmin();
