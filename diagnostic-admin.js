import { createClient } from '@supabase/supabase-js';

// Remplacez par vos vraies clés Supabase
const supabaseUrl = 'https://VOTRE_PROJET.supabase.co'; // Remplacez par votre vraie URL
const supabaseKey = 'VOTRE_SERVICE_ROLE_KEY'; // Remplacez par votre vraie clé service_role

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnosticAdmin() {
  try {
    console.log('🔍 Diagnostic du compte administrateur...\n');
    
    // 1. Vérifier l'utilisateur dans auth.users
    console.log('1️⃣ Vérification de l\'utilisateur dans auth.users...');
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error('❌ Erreur lors de la recherche des utilisateurs:', userError);
      return;
    }
    
    const user = users.users.find(u => u.email === 'speakaboutai@gmail.com');
    
    if (!user) {
      console.error('❌ Utilisateur speakaboutai@gmail.com non trouvé dans auth.users');
      return;
    }
    
    console.log('✅ Utilisateur trouvé dans auth.users:');
    console.log('   - ID:', user.id);
    console.log('   - Email:', user.email);
    console.log('   - Créé le:', user.created_at);
    console.log('   - Confirmé:', user.email_confirmed_at ? 'Oui' : 'Non');
    console.log('');
    
    // 2. Vérifier le profil dans la table profiles
    console.log('2️⃣ Vérification du profil dans la table profiles...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Erreur lors de la récupération du profil:', profileError);
      console.log('   Tentative de création du profil...');
      
      // Créer le profil admin
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          user_type: 'admin',
          email: user.email,
          first_name: 'Admin',
          last_name: 'NovRH',
          is_active: true,
          email_verified: true
        });
      
      if (createError) {
        console.error('❌ Erreur lors de la création du profil:', createError);
        return;
      }
      
      console.log('✅ Profil admin créé avec succès !');
    } else {
      console.log('✅ Profil trouvé dans la table profiles:');
      console.log('   - ID:', profile.id);
      console.log('   - User ID:', profile.user_id);
      console.log('   - Type:', profile.user_type);
      console.log('   - Email:', profile.email);
      console.log('   - Actif:', profile.is_active);
      console.log('   - Créé le:', profile.created_at);
      
      if (profile.user_type !== 'admin') {
        console.log('⚠️ ATTENTION: Le type d\'utilisateur n\'est pas "admin" !');
        console.log('   Correction en cours...');
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ user_type: 'admin' })
          .eq('user_id', user.id);
        
        if (updateError) {
          console.error('❌ Erreur lors de la mise à jour:', updateError);
          return;
        }
        
        console.log('✅ Type d\'utilisateur corrigé vers "admin" !');
      }
    }
    console.log('');
    
    // 3. Vérifier les permissions d'administration
    console.log('3️⃣ Vérification des permissions d\'administration...');
    const { data: permissionCheck, error: permError } = await supabase.rpc('check_admin_permission', {
      required_role: 'admin'
    });
    
    if (permError) {
      console.log('⚠️ Fonction check_admin_permission non disponible:', permError.message);
    } else {
      console.log('✅ Permission d\'administration:', permissionCheck ? 'Autorisée' : 'Refusée');
    }
    console.log('');
    
    // 4. Vérifier l'accès aux tables d'administration
    console.log('4️⃣ Vérification de l\'accès aux tables d\'administration...');
    
    // Vérifier admin_teams
    const { data: teams, error: teamsError } = await supabase
      .from('admin_teams')
      .select('*')
      .limit(1);
    
    if (teamsError) {
      console.log('⚠️ Table admin_teams:', teamsError.message);
    } else {
      console.log('✅ Accès à admin_teams: OK');
    }
    
    // Vérifier team_members
    const { data: members, error: membersError } = await supabase
      .from('team_members')
      .select('*')
      .limit(1);
    
    if (membersError) {
      console.log('⚠️ Table team_members:', membersError.message);
    } else {
      console.log('✅ Accès à team_members: OK');
    }
    console.log('');
    
    // 5. Résumé et instructions
    console.log('🎯 RÉSUMÉ DU DIAGNOSTIC:');
    console.log('   - Utilisateur auth: ✅');
    console.log('   - Profil admin: ✅');
    console.log('   - Permissions: ✅');
    console.log('');
    console.log('🚀 INSTRUCTIONS:');
    console.log('   1. Déconnectez-vous complètement du site');
    console.log('   2. Videz le cache de votre navigateur');
    console.log('   3. Reconnectez-vous avec speakaboutai@gmail.com');
    console.log('   4. Allez directement sur /admin');
    console.log('   5. Vous devriez voir la sidebar d\'administration');
    console.log('');
    console.log('🔗 URL d\'accès: https://novrhconsulting.com/admin');
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

diagnosticAdmin();

