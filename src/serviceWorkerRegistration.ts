export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = 'serviceWorker.js';

      (navigator as Navigator).serviceWorker
        .register(swUrl)
        .then((registration: ServiceWorkerRegistration) => {
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              return;
            }
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if ((navigator as Navigator).serviceWorker.controller) {
                  console.log('New content is available; please refresh.');
                } else {
                  console.log('Content is cached for offline use.');
                }
              }
            };
          };
        })
        .catch((error: any) => {
          console.error('Error during service worker registration:', error);
        });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    (navigator as Navigator).serviceWorker.ready
      .then((registration: ServiceWorkerRegistration) => {
        registration.unregister();
      })
      .catch((error: any) => {
        console.error(error.message);
      });
  }
} 