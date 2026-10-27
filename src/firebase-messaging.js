import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";
import firebaseApp from "./firebase-app";

// Correctly export a promise that resolves to messaging instance (or null)
export const getMessagingObject = async () => {
  try {
    const isSupportedBrowser = await isSupported();
    if (isSupportedBrowser) {
      return getMessaging(firebaseApp);
    }
    return null;
  } catch (err) {
    console.error("Messaging not supported:", err);
    return null;
  }
};

const getMessagingServiceWorker = async () => {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  // Keep Firebase's push worker separate from the offline worker registered
  // at `/`. Registering both at `/` makes them replace one another.
  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js",
    { scope: "/firebase/" }
  );
  const worker = registration.installing || registration.waiting;

  if (worker && worker.state !== "activated") {
    await new Promise((resolve, reject) => {
      const handleStateChange = () => {
        if (worker.state === "activated") {
          worker.removeEventListener("statechange", handleStateChange);
          resolve();
        } else if (worker.state === "redundant") {
          worker.removeEventListener("statechange", handleStateChange);
          reject(
            new Error("Firebase messaging service worker failed to activate")
          );
        }
      };

      worker.addEventListener("statechange", handleStateChange);
      handleStateChange();
    });
  }

  if (!registration.active) {
    throw new Error("Firebase messaging service worker is not active");
  }

  return registration;
};

// fetchToken function
export const fetchToken = async (setTokenFound, setFcmToken) => {
  try {
    // Skip entirely when the user blocked notifications — calling getToken
    // then throws messaging/permission-blocked, which Next dev surfaces as a
    // runtime error overlay. Not an app bug, just a declined permission.
    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "denied"
    ) {
      return;
    }
    const messaging = await getMessagingObject();
    if (!messaging) return;
    const serviceWorkerRegistration = await getMessagingServiceWorker();
    if (!serviceWorkerRegistration) return;

    const currentToken = await getToken(messaging, {
      serviceWorkerRegistration,
      vapidKey:
        "BFyeO2SnW09j8eJjb3rmOcjdA5yYrly0Z3FVeNvLoY01pxu_fA4CyPhLB8nFjmTadTSfAmz67m6fCVfzMP1ixRg",
    });

    if (currentToken) {
      setTokenFound(true);
      setFcmToken(currentToken);
    } else {
      setTokenFound(false);
      setFcmToken();
    }
  } catch (err) {
    // Blocked/dismissed permission is an expected user choice, not an error —
    // stay silent so it never trips the dev overlay or error monitoring.
    if (
      err?.code === "messaging/permission-blocked" ||
      err?.code === "messaging/permission-default"
    ) {
      return;
    }
    console.error("Token fetch error:", err);
  }
};

// onMessageListener function
export const onMessageListener = async () =>
  new Promise(async (resolve, reject) => {
    try {
      const messaging = await getMessagingObject();
      if (!messaging) return;

      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    } catch (err) {
      reject(err);
    }
  });

// Return the unsubscribe function so route changes do not retain listeners.
export const subscribeToMessages = async (listener) => {
  const messaging = await getMessagingObject();
  return messaging ? onMessage(messaging, listener) : () => {};
};
