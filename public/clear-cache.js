// Utility script to clear browser cache and service workers
// Run this in browser console if you encounter cache issues

console.log('Clearing browser cache and service workers...');

// Clear service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
      console.log('Unregistered service worker:', registration);
    }
  });
}

// Clear caches
if ('caches' in window) {
  caches.keys().then(function(names) {
    for (let name of names) {
      caches.delete(name);
      console.log('Deleted cache:', name);
    }
  });
}

// Clear localStorage and sessionStorage
localStorage.clear();
sessionStorage.clear();
console.log('Cleared localStorage and sessionStorage');

// Reload the page
console.log('Reloading page...');
window.location.reload(); 