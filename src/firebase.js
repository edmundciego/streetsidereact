import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCNBXZ4uEOU7hAHkvEZJGIsUw3WN3hC38M",
  authDomain: "streetsideco.firebaseapp.com",
  databaseURL: "https://streetsideco.firebaseio.com",
  projectId: "streetsideco",
  storageBucket: "streetsideco.appspot.com",
  messagingSenderId: "296214775948",
  appId: "1:296214775948:web:28245f40ca12c7043dd3a9",
  measurementId: "G-725TBL6QQ2",
};

const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(firebaseApp);

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

// fetchToken function
export const fetchToken = async (setTokenFound, setFcmToken) => {
  try {
    const messaging = await getMessagingObject();
    if (!messaging) return;

    // Keep Firebase's worker in its own narrow scope. The marketplace runtime
    // worker controls `/`, so neither registration can replace the other.
    const serviceWorkerRegistration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
      { scope: "/firebase-cloud-messaging-push-scope" }
    );
    const currentToken = await getToken(messaging, {
      vapidKey:
        "BFyeO2SnW09j8eJjb3rmOcjdA5yYrly0Z3FVeNvLoY01pxu_fA4CyPhLB8nFjmTadTSfAmz67m6fCVfzMP1ixRg",
      serviceWorkerRegistration,
    });

    if (currentToken) {
      setTokenFound(true);
      setFcmToken(currentToken);
    } else {
      setTokenFound(false);
      setFcmToken();
    }
  } catch (err) {
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
