import { initializeApp, getApps, getApp } from "firebase/app";

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

export default firebaseApp;
