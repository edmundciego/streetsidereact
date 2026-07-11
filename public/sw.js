/* Streetside public runtime cache. Never cache authenticated or mutating API requests. */
const VERSION = "streetside-runtime-v1";
const CACHE = {
  static: `${VERSION}-static`,
  images: `${VERSION}-images`,
  content: `${VERSION}-content`,
  catalog: `${VERSION}-catalog`,
  pages: `${VERSION}-pages`,
};

const MAX_ENTRIES = { static: 120, images: 200, content: 40, catalog: 60 };
const MAX_AGE = {
  config: 60 * 1000,
  landing: 5 * 60 * 1000,
  reference: 5 * 60 * 1000,
  catalog: 60 * 1000,
  image: 7 * 24 * 60 * 60 * 1000,
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE.pages).then((cache) => cache.add("/offline"))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key.startsWith("streetside-runtime-") &&
                !key.startsWith(VERSION)
            )
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

const cacheKey = (request) => {
  const url = new URL(request.url);
  // Cache API does not key by arbitrary request headers. Keep the public API
  // variants separate for language, zone, and module without touching normal
  // query parameters.
  ["x-localization", "zoneid", "moduleid"].forEach((header) => {
    const value = request.headers.get(header);
    if (value) url.searchParams.set(`__ss_${header}`, value);
  });
  return new Request(url.toString(), { method: "GET" });
};

const cacheMetadataKey = (request) => {
  const url = new URL(cacheKey(request).url);
  url.searchParams.set("__ss_cached_at", "1");
  return new Request(url.toString(), { method: "GET" });
};

const fresh = async (cache, request, response, maxAge) => {
  if (!response) return false;
  const metadata = await cache.match(cacheMetadataKey(request));
  const cachedAt = metadata ? Number(await metadata.text()) : NaN;
  return Number.isFinite(cachedAt) && Date.now() - cachedAt <= maxAge;
};

const trim = async (cacheName, limit) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  const dataKeys = keys.filter(
    (key) => !new URL(key.url).searchParams.has("__ss_cached_at")
  );
  const expiredKeys = dataKeys.slice(0, Math.max(0, dataKeys.length - limit));
  await Promise.all(
    expiredKeys.flatMap((key) => [
      cache.delete(key),
      cache.delete(cacheMetadataKey(key)),
    ])
  );
};

const put = async (cacheName, request, response, limit) => {
  if (!response || !(response.ok || response.type === "opaque"))
    return response;
  const cache = await caches.open(cacheName);
  await cache.put(cacheKey(request), response.clone());
  await cache.put(
    cacheMetadataKey(request),
    new Response(String(Date.now()), {
      headers: { "content-type": "text/plain" },
    })
  );
  if (limit) await trim(cacheName, limit);
  return response;
};

const cacheFirst = async (request, cacheName, maxAge, limit) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(cacheKey(request));
  if (await fresh(cache, request, cached, maxAge)) return cached;
  try {
    return await put(cacheName, request, await fetch(request), limit);
  } catch (error) {
    if (cached) return cached;
    throw error;
  }
};

const staleWhileRevalidate = async (request, cacheName, maxAge, limit) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(cacheKey(request));
  const network = fetch(request)
    .then((response) => put(cacheName, request, response, limit))
    .catch(() => null);
  if (await fresh(cache, request, cached, maxAge)) {
    network.catch(() => null);
    return cached;
  }
  return (await network) || cached || fetch(request);
};

const networkFirst = async (request, cacheName, maxAge, limit) => {
  try {
    return await put(cacheName, request, await fetch(request), limit);
  } catch (error) {
    const cached = await (
      await caches.open(cacheName)
    ).match(cacheKey(request));
    const cache = await caches.open(cacheName);
    if (await fresh(cache, request, cached, maxAge)) return cached;
    throw error;
  }
};

const isPublicRequest = (request) =>
  request.method === "GET" && !request.headers.has("authorization");

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (!isPublicRequest(request)) return;
  const url = new URL(request.url);
  const path = url.pathname;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(
        async () => (await caches.match(request)) || caches.match("/offline")
      )
    );
    return;
  }
  if (path.startsWith("/_next/static/")) {
    event.respondWith(
      cacheFirst(request, CACHE.static, MAX_AGE.image, MAX_ENTRIES.static)
    );
    return;
  }
  if (
    /\.(?:png|jpe?g|webp|gif|svg|ico|avif)$/i.test(path) ||
    path.startsWith("/_next/image")
  ) {
    event.respondWith(
      cacheFirst(request, CACHE.images, MAX_AGE.image, MAX_ENTRIES.images)
    );
    return;
  }
  if (url.hostname === "fonts.googleapis.com") {
    event.respondWith(
      staleWhileRevalidate(
        request,
        CACHE.content,
        24 * 60 * 60 * 1000,
        MAX_ENTRIES.content
      )
    );
    return;
  }
  if (url.hostname === "fonts.gstatic.com") {
    event.respondWith(
      cacheFirst(
        request,
        CACHE.static,
        365 * 24 * 60 * 60 * 1000,
        MAX_ENTRIES.static
      )
    );
    return;
  }
  if (!/\/api\/v1\//.test(path)) return;

  if (/\/api\/v1\/config$/.test(path)) {
    event.respondWith(
      staleWhileRevalidate(
        request,
        CACHE.content,
        MAX_AGE.config,
        MAX_ENTRIES.content
      )
    );
  } else if (/\/api\/v1\/react-landing-page$/.test(path)) {
    event.respondWith(
      staleWhileRevalidate(
        request,
        CACHE.content,
        MAX_AGE.landing,
        MAX_ENTRIES.content
      )
    );
  } else if (/\/api\/v1\/(categories|module)(?:\/|$)/.test(path)) {
    event.respondWith(
      staleWhileRevalidate(
        request,
        CACHE.content,
        MAX_AGE.reference,
        MAX_ENTRIES.content
      )
    );
  } else if (
    /\/api\/v1\/(items|stores|banners|campaigns|flash-sales)(?:\/|$)/.test(path)
  ) {
    event.respondWith(
      networkFirst(request, CACHE.catalog, MAX_AGE.catalog, MAX_ENTRIES.catalog)
    );
  }
});
