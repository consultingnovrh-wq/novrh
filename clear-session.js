// Script pour forcer la déconnexion et nettoyer la session
// Exécutez ce code dans la console du navigateur (F12)

console.log('🧹 Nettoyage de la session NovRH...');

// 1. Supprimer tous les cookies liés au site
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});

// 2. Supprimer le localStorage
localStorage.clear();

// 3. Supprimer le sessionStorage
sessionStorage.clear();

// 4. Supprimer les données IndexedDB
if ('indexedDB' in window) {
  indexedDB.databases().then(databases => {
    databases.forEach(db => {
      indexedDB.deleteDatabase(db.name);
    });
  });
}

console.log('✅ Session nettoyée !');
console.log('🔄 Rechargez la page et reconnectez-vous');

// 5. Recharger la page
window.location.reload();
