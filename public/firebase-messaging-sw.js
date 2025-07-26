importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);
// // Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyCNBXZ4uEOU7hAHkvEZJGIsUw3WN3hC38M",
  authDomain: "streetsideco.firebaseapp.com",
  databaseURL: "https://streetsideco.firebaseio.com",
  projectId: "streetsideco",
  storageBucket: "streetsideco.appspot.com",
  messagingSenderId: "296214775948",
  appId: "1:296214775948:web:28245f40ca12c7043dd3a9",
  measurementId: "G-725TBL6QQ2"
};

firebase?.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase?.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
