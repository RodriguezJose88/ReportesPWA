// console.log("SW.js")
//todos los archivos de la app propios
//login dirigido hacia los dispositivos moviles
const STATIC = 'staticv1';
const INMUTABLE ='inmutablev1';
const DYNAMIC = 'dynamicv1';
const CACHE_NAME = 'my-site-cache-v1';
const OFFLINE_URL = '/offline.html';
const APP_SHELL = [
    '/',
    '/index.html',
    'page2.html',
    'offline.html',
    'img/picachu.jpg',
    'js/app.js',
    'css/style.css',
];

const APP_SHELL_INMUTABLE =[
    'https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([OFFLINE_URL]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // Retorna desde la caché si está disponible.
      }
      return fetch(event.request)
        .then((onlineResponse) => {
          if (onlineResponse.status === 200) {
           
            const responseClone = onlineResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
            return onlineResponse;
          }
    
          return caches.match(OFFLINE_URL);
        })
        .catch(() => {
  
          return caches.match(OFFLINE_URL);
        });
    })
  );
});
// ARRIBA LO QUE HICE AHORA
/////////////////////////////




// self.addEventListener('install', (e) => {
//     console.log("Instalando...")
//     const staticCache= caches.open(STATIC)
//     .then((cache)=>{
//         cache.addAll(APP_SHELL);
//     });
    
//     const inmutableCache = caches.open(INMUTABLE)
//     .then((cache)=>{
//         cache.addAll(APP_SHELL_INMUTABLE)
//     });

//     //esperar que todo termine
//     e.waitUntil(Promise.all([staticCache,inmutableCache]));

//     //open abrir o crea run nuevo cache
// });

// self.addEventListener('activate', (e) => {
//     console.log("Activado")
//     e.waitUntil(
//         caches.keys().then(cacheNames => {
//           return Promise.all(
//             cacheNames.filter(cacheName => cacheName !== STATIC).map(cacheName => {
//               return caches.delete(cacheName);
//             })
//           );
//         })
//       );
// });


// self.addEventListener('fetch', (e)=>{
// console.log(e.request);

// e.respondWith(
//     caches.match(e.request).then(response => {
//       return response || fetch(e.request);
//     })
//   );
// //5 Estrategia
// //Cache and network race
// const sourse = new Promise((resolve, reject =>{
//   let flag = false;
//   const failOnce = ()=>{
//     //si fallo una vez aqui poner la logica para controlarlo
//     if (flag){

//       if(/\.(png|jpg)/i.test(e.request.url)){
//         resolve(caches.match('/img/not-found.png'));
//       }else {
//         reject('SourseNotFound');
//       }
  
//     }else{
//       flag = true;
//     }
//   };
//   fetch(e.request).then(resFetch =>{
//     resFetch.ok? resolve(resFetch): failOnce();
//   }).catch(failOnce);
  
//   caches.match(e.request).then(sourseCache=>{
//     sourseCache.ok? resolve(sourseCache): failOnce();
//   })
//   .catch(failOnce);
// }));
//  e.respondWith(sourse);

/// Estategia 4
//Cache with network update
//primero todo lo devuelve cache
// despues actualiza el recurso
//cuando el equipo sea de bajo rendimiento, siempre se queda un paso atras

// const sourse =
// caches.open(STATIC).then(cache =>{
//   fetch(e.request).then(resFetch =>{
//     cache.put(e.request, resFetch);
//   });
// return cache.match(e.request)

// });
// e.respondWith(sourse);
///7
//1Cache Only
//e.respondWith(caches.matche(e.request));

//2 Cache with network fallback //despacha todo el cache si no lo  encuentra va a internet
// const sourse = caches.match(e.request)
// .then(res=>{
//     if(res) return res;
//     return fetch(e.request).then(resFetch=>{
//         caches.open(DYNAMIC).then(cache=>{
//             cache.put(e.request,resFetch);
//         });
//         return resFetch.clone();
//     });
// });
// e.respondWith(sourse);

///////////////////
//3.Cache with cache fallback busca en el internet y si no lo manda en el cache 
// const sourse = fetch(e.request)
// .then(res=>{
//     if (!res) throw Error("NotFound");
//     caches.open(DYNAMIC).then(caches=>{
//         cache.put(e.request,res);
//     });
//     return res.clone();
// })
// .catch((err)=>{
//     return caches.match(e.request);
// });
// e.respondWith(sourse);

////////////// img XD
// if(e.request.url.includes('pikachu.jpg')){
//     e.respondWith(fetch('img/piplup.png'));
// }else e.responWith(fetch(e.request));

