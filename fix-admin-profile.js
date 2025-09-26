import { createClient } from '@supabase/supabase-js';

// Remplacez par vos vraies clés Supabase
const supabaseUrl = 'https://votre-projet.supabase.co'; // Remplacez par votre URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Remplacez par votre service_role key

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixAdminProfile() {
  try {
    console.log('🔍 Recherche de l\'utilisateur speakaboutai@gmail.com...');
    
    // Trouver l'utilisateur par email
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error('❌ Erreur lors de la recherche des utilisateurs:', userError);
      return;
    }
    
    const user = users.users.find(u => u.email === 'speakaboutai@gmail.com');
    
    if (!user) {
      console.error('❌ Utilisateur speakaboutai@gmail.com non trouvé');
      return;
    }
    
    console.log('✅ Utilisateur trouvé:', user.id);
    
    // Vérifier si le profil existe
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (profileError) {
      console.log('⚠️ Profil non trouvé, création...');
      
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
      console.log('📝 Profil existant trouvé, mise à jour...');
      
      // Mettre à jour le profil existant
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          user_type: 'admin',
          email: user.email,
          first_name: 'Admin',
          last_name: 'NovRH',
          is_active: true,
          email_verified: true
        })
        .eq('user_id', user.id);
      
      if (updateError) {
        console.error('❌ Erreur lors de la mise à jour:', updateError);
        return;
      }
      
      console.log('✅ Profil admin mis à jour avec succès !');
    }
    
    console.log('🎉 Configuration terminée ! Vous pouvez maintenant vous connecter sur /admin');
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

fixAdminProfile();
