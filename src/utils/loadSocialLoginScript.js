const scripts = {
  google: {
    id: "google-identity-services",
    src: "https://accounts.google.com/gsi/client",
    isReady: () => Boolean(window.google?.accounts?.id),
  },
  apple: {
    id: "appleid-auth-sdk",
    src: "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js",
    isReady: () => Boolean(window.AppleID),
  },
};

const pendingLoads = new Map();

export const loadSocialLoginScript = (provider) => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Social login scripts require a browser"));
  }

  const scriptConfig = scripts[provider];
  if (!scriptConfig) {
    return Promise.reject(new Error(`Unknown social login provider: ${provider}`));
  }

  if (scriptConfig.isReady()) return Promise.resolve();

  const pendingLoad = pendingLoads.get(provider);
  if (pendingLoad) return pendingLoad;

  const promise = new Promise((resolve, reject) => {
    let script = document.getElementById(scriptConfig.id);
    const onLoad = () => {
      if (scriptConfig.isReady()) {
        resolve();
      } else {
        pendingLoads.delete(provider);
        reject(new Error(`${provider} login script loaded without its SDK`));
      }
    };
    const onError = () => {
      pendingLoads.delete(provider);
      reject(new Error(`Failed to load ${provider} login script`));
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptConfig.id;
      script.src = scriptConfig.src;
      script.async = true;
      script.addEventListener("load", onLoad, { once: true });
      script.addEventListener("error", onError, { once: true });
      document.head.appendChild(script);
      return;
    }

    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", onError, { once: true });
  });

  pendingLoads.set(provider, promise);
  return promise;
};
