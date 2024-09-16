const admin = require('firebase-admin');

// Using Emulators in Local Environment (Comment out if not using)
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";

// Initialize Firebase Admin
admin.initializeApp();

module.exports = admin;
