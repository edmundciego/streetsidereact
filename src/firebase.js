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
const messaging = (async () => {
  try {
    const isSupportedBrowser = await isSupported();
    if (isSupportedBrowser) {
      return getMessaging(firebaseApp);
    }
    return null;
  } catch (err) {
    return null;
  }
})();

export const fetchToken = async (setTokenFound, setFcmToken) => {
  return getToken(await messaging, {
    vapidKey:
      "BFyeO2SnW09j8eJjb3rmOcjdA5yYrly0Z3FVeNvLoY01pxu_fA4CyPhLB8nFjmTadTSfAmz67m6fCVfzMP1ixRg",
  })
    .then((currentToken) => {
      if (currentToken) {
        setTokenFound(true);
        setFcmToken(currentToken);

        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        setTokenFound(false);
        setFcmToken();
        // shows on the UI that permission is required
      }
    })
    .catch((err) => {
      console.error(err);
      // catch error while creating client token
    });
};

export const onMessageListener = async () =>
  new Promise((resolve) =>
    (async () => {
      const messagingResolve = await messaging;
      onMessage(messagingResolve, (payload) => {
        resolve(payload);
      });
    })()
  );
export const auth = getAuth(firebaseApp);
