const SW_NIMI = "OPPINEN";
const sailottavat_tiedostot = [
    "/",
    "/main.js",
    "/sw.js"
];

self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(SW_NIMI)
            .then(c => c.addAll(sailottavat_tiedostot))
            .catch(e => console.log(e))
    );
});

self.addEventListener("fetch", e => {
    return;
    console.log("tässä", e.request);
    const url = e.request.url;
    const kautat = url.split("/")-1;
    if (e.request.mode === "navigate" && !(kautat === 2 || (kautat === 3 && url.at(-1) === "/")))
        e.respondWith(caches.match("/"));
    else
        e.respondWith(
            caches.match(e.request)
                .then(response => response || fetch(e.request))
        );
});