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
  projectId: "streetsideco",
  storageBucket: "streetsideco.appspot.com",
  messagingSenderId: "296214775948",
  appId: "1:296214775948:web:28245f40ca12c7043dd3a9",

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

    const currentToken = await getToken(messaging, {
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
