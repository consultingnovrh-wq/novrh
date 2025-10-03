// Script pour déboguer pourquoi l'entreprise va vers login au lieu du dashboard
// Exécuter dans la console navigateur après connexion comme entreprise

console.log('🔍 DIAGNOSTIC NAVIGATION ENTREPRISE');

// 1. Vérifier l'état utilisateur
console.log('👤 État utilisateur:');
const { createClient } = await import('@supabase/supabase-js');

const supabaseUrl = 'https://dsxkfzqggghwqiihierm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzeGZncnZwZ2cghd3FpaWlpaWVybSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzMzOTI5NjMxLCJleHAiOjIwNDk1MDU2MzF9.v1nBfE1fO5_8K5L_Rz9XhLjG9LkKYLJbYYcH8KcWK4w';

const { data: { user }, error: userError } = await supabase.auth.getUser();
console.log('User:', user);
console.log('User Error:', userError);

if (user) {
    // 2. Vérifier le profil 
    console.log('\n📊 Profil utilisateur:');
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
    console.log('Profile:', profile);
    console.log('Profile Error:', profileError);
    
    // 3. Vérifier les données entreprise
    console.log('\n🏢 Données entreprise:');
    const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
    console.log('Company:', company);
    console.log('Company Error:', companyError);
    
    // 4. Test navigation programmatique
    console.log('\n🧭 Test navigation:');
    console.log('URL actuelle:', window.location.href);
    console.log('User type:', profile?.user_type);
    
    if (profile?.user_type === 'company') {
        console.log('✅ Utilisateur est une entreprise - devrait pouvoir aller vers /dashboard/company');
        
        // Tester la navigation
        console.log('Tentative de navigation vers /dashboard/company...');
        window.location.href = '/dashboard/company';
    } else {
        console.log('❌ Utilisateur n\'est pas marqué comme entreprise:', profile?.user_type);
    }
} else {
    console.log('❌ Pas d\'utilisateur connecté');
}

console.log('\n📋 Variables globales:');
console.log('LocalStorage keys:', Object.keys(localStorage));
console.log('SessionStorage keys:', Object.keys(sessionStorage));
