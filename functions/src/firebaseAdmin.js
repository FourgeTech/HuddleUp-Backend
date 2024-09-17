const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccount.json');

// Use emulators if running in the local environment
if (process.env.FUNCTIONS_EMULATOR) {
    // Firestore emulator
    process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
  
    // Firebase Auth emulator
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
  }

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
