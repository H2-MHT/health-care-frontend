importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js");

const firebaseConfig = {
    apiKey: "AIzaSyCPJX_TJw3xFSUkZNHoDfrlX-KiSPnUd24",
    authDomain: "health-help-2fa03.firebaseapp.com",
    projectId: "health-help-2fa03",
    storageBucket: "health-help-2fa03.appspot.com",
    messagingSenderId: "647085665903",
    appId: "1:647085665903:web:740fe67d07696e32b9279a",
    measurementId: "G-2F0E5KGLRN"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Background notification handler
messaging.onBackgroundMessage((payload) => {
    console.log("Received background message ", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "/favicon.ico", // Change to your app's logo
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
