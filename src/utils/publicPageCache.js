import { LRUCache } from "lru-cache";

// Only for unauthenticated, shared configuration and SEO responses. Bound the
// cache and freshness window; never use it for customer or transaction data.
const publicPageCache = new LRUCache({ max: 200, ttl: 30_000 });

export const getPublicPageData = async (key, load) => {
  const cached = publicPageCache.get(key);
  if (cached) return cached;

  // Share in-flight requests as well as completed responses.
  const pending = Promise.resolve().then(load);
  publicPageCache.set(key, pending);
  try {
    const data = await pending;
    if (data == null && publicPageCache.peek(key) === pending) {
      publicPageCache.delete(key);
    }
    return data;
  } catch (error) {
    if (publicPageCache.peek(key) === pending) publicPageCache.delete(key);
    throw error;
  }
};
