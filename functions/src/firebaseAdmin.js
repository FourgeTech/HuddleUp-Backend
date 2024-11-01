const admin = require('firebase-admin');

// Use emulators if running in the local environment
if (process.env.FUNCTIONS_EMULATOR) {
    // Firestore emulator
    process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
  
    // Firebase Auth emulator
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
  }

// Initialize Firebase Admin
if (process.env.NODE_ENV !== 'test') {
  const serviceAccount = require('../serviceAccount.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  admin.initializeApp();
}



module.exports = admin;