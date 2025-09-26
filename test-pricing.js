// Script de test pour vérifier la configuration de la tarification
console.log('🧪 Test de la configuration de la tarification NovRH');

// Vérification des fichiers créés
const fs = require('fs');
const path = require('path');

const filesToCheck = [
  'src/types/pricing.ts',
  'src/hooks/use-pricing.ts',
  'src/components/PricingGate.tsx',
  'src/components/PricingBanner.tsx',
  'src/pages/Pricing.tsx',
  'supabase/migrations/20250716135526-pricing-system.sql'
];

console.log('\n📁 Vérification des fichiers créés:');
filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MANQUANT`);
  }
});

// Vérification de la structure des types
console.log('\n🔍 Vérification de la structure des types:');
try {
  const typesContent = fs.readFileSync('src/types/pricing.ts', 'utf8');
  
  if (typesContent.includes('PricingPlan')) console.log('✅ Interface PricingPlan');
  if (typesContent.includes('UserSubscription')) console.log('✅ Interface UserSubscription');
  if (typesContent.includes('FeatureUsage')) console.log('✅ Interface FeatureUsage');
  if (typesContent.includes('FEATURES')) console.log('✅ Constante FEATURES');
  if (typesContent.includes('cv_coaching')) console.log('✅ Fonctionnalité cv_coaching');
  if (typesContent.includes('job_posting')) console.log('✅ Fonctionnalité job_posting');
  
} catch (error) {
  console.log('❌ Erreur lors de la lecture des types:', error.message);
}

// Vérification de la migration SQL
console.log('\n🗄️ Vérification de la migration SQL:');
try {
  const migrationContent = fs.readFileSync('supabase/migrations/20250716135526-pricing-system.sql', 'utf8');
  
  if (migrationContent.includes('CREATE TABLE public.pricing_plans')) console.log('✅ Table pricing_plans');
  if (migrationContent.includes('CREATE TABLE public.user_subscriptions')) console.log('✅ Table user_subscriptions');
  if (migrationContent.includes('CREATE TABLE public.feature_usage')) console.log('✅ Table feature_usage');
  if (migrationContent.includes('Coaching CV International')) console.log('✅ Plan Coaching CV International');
  if (migrationContent.includes('Recrutement Complet 0-100')) console.log('✅ Plan Recrutement Complet');
  if (migrationContent.includes('student_international')) console.log('✅ Catégorie student_international');
  
} catch (error) {
  console.log('❌ Erreur lors de la lecture de la migration:', error.message);
}

// Vérification de l'intégration dans App.tsx
console.log('\n🔗 Vérification de l\'intégration:');
try {
  const appContent = fs.readFileSync('src/App.tsx', 'utf8');
  
  if (appContent.includes('import Pricing from "./pages/Pricing"')) console.log('✅ Import Pricing');
  if (appContent.includes('<Route path="/pricing" element={<Pricing />} />')) console.log('✅ Route /pricing');
  
} catch (error) {
  console.log('❌ Erreur lors de la lecture d\'App.tsx:', error.message);
}

// Vérification du Header
console.log('\n🧭 Vérification du Header:');
try {
  const headerContent = fs.readFileSync('src/components/Header.tsx', 'utf8');
  
  if (headerContent.includes('TARIFS')) console.log('✅ Lien TARIFS dans la navigation');
  if (headerContent.includes('/pricing')) console.log('✅ Lien vers /pricing');
  
} catch (error) {
  console.log('❌ Erreur lors de la lecture du Header:', error.message);
}

console.log('\n🎯 Résumé des tests:');
console.log('Si tous les ✅ sont présents, votre système de tarification est prêt !');
console.log('\n📋 Prochaines étapes:');
console.log('1. Exécuter la migration Supabase: supabase db push');
console.log('2. Tester la page /pricing dans le navigateur');
console.log('3. Vérifier que PricingGate protège /post-job');
console.log('4. Tester les filtres par catégorie');

