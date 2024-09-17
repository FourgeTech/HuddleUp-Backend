const admin = require('firebase-admin');

// Using Emulators in Local Environment (Comment out if not using)
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";

const firebaseConfig = {
    apiKey: "AIzaSyCAu-BgV1PWSaDmCdqXWwNawyd5TLGIPcU",
    authDomain: "huddleup-43c6a.firebaseapp.com",
    projectId: "huddleup-43c6a",
    storageBucket: "huddleup-43c6a.appspot.com",
    messagingSenderId: "769306836182",
    appId: "1:769306836182:web:b765b8f60ea42d92c4dd77",
    measurementId: "G-WRGE4HTGFF"
  };

// Initialize Firebase Admin
admin.initializeApp(firebaseConfig);

module.exports = admin;
