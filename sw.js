const cacheName = 'v1';

// call the install event
self.addEventListener('install', function(e){
   console.log("Service worker: Installed");
});

self.addEventListener('activate', function(e){
  console.log('Service worker: Activated');
  // clearing out unwanted cache
  e.waitUntil(
    cacheKeys()
    .then(function(cacheNames){
      return promise.all(
        cacheNames.map(cache => {
          if(cache !== cacheName){
            console.log('Service worker: Clearing old cache');
            return caches.delete(cache);
          }
        }));
    }));
});

//call the fetch event 
self.addEventListener('fetch', function(e){
  console.log('Service worker: Fetching');
  e.respondWith(
    fetch(e.request)
    .then(function(res){
      // Make copy/clone of response
        const resClone = res.clone();
      // Open cache
        caches.open(cacheName)
        .then(function (cache){
          // Add response to cache
          cache.put(e.request, resClone);
        });
        return res;
      })
     .catch(function(err){ 
       caches.match(e.request)
       .then(function(res) {
         return res;
         
       });
      })
    );
  
});