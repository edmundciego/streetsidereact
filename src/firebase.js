import { getAuth } from "firebase/auth";
import firebaseApp from "./firebase-app";

export const auth = getAuth(firebaseApp);
export {
  fetchToken,
  getMessagingObject,
  onMessageListener,
} from "./firebase-messaging";
