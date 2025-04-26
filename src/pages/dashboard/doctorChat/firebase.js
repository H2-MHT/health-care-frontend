// import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database";

// // const firebaseConfig = {
// //   apiKey: "AIzaSyCPJX_TJw3xFSUkZNHoDfrlX-KiSPnUd24",
// //   authDomain: "health-help-2fa03.firebaseapp.com",
// //   databaseURL: "https://health-help-2fa03-default-rtdb.firebaseio.com",
// //   projectId: "health-help-2fa03",
// //   storageBucket: "health-help-2fa03.firebasestorage.app",
// //   messagingSenderId: "647085665903",
// //   appId: "1:647085665903:web:740fe67d07696e32b9279a"
// // };

// const firebaseConfig = {
//     apiKey: "AIzaSyCPJX_TJw3xFSUkZNHoDfrlX-KiSPnUd24",
//     authDomain: "health-help-2fa03.firebaseapp.com",
//     projectId: "health-help-2fa03",
//     storageBucket: "health-help-2fa03.firebasestorage.app",
//     messagingSenderId: "647085665903",
//     appId: "1:647085665903:web:740fe67d07696e32b9279a",
//     measurementId: "G-2F0E5KGLRN"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);

// export { db };


import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCPJX_TJw3xFSUkZNHoDfrlX-KiSPnUd24",
    authDomain: "health-help-2fa03.firebaseapp.com",
    projectId: "health-help-2fa03",
    storageBucket: "health-help-2fa03.firebasestorage.app",
    messagingSenderId: "647085665903",
    appId: "1:647085665903:web:740fe67d07696e32b9279a",
    measurementId: "G-2F0E5KGLRN"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request Permission for Notifications
export const requestForToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BC683eTp4ATpYrkaYi3xex6GLTxloU08q_4Nqf6_z2ykQmJGaxVsIpKadBUenLG0IRYOHsJ48o2omhv9lkwXw8c",
    });
    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
  }
};

// Handle Incoming Messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    try {
      onMessage(messaging, (payload) => {
        console.log("Message received:", payload);
        resolve(payload);
      });
    } catch (error) {
      console.log("Error in onMessageListener ", error)
    }
  });

export default messaging;
