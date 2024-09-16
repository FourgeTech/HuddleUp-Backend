const functions = require('firebase-functions');
const { createUser, createUserWithGoogle, checkGoogleUserExists } = require('./src/controllers/userController');
const firebaseAdmin = require('./src/firebaseAdmin');

// exports.helloWorld = functions.https.onCall((data, context) => {
//     return {
//         message: 'Hello, World!'
//     };
// });

// Create a new user
exports.createUser = createUser;
exports.createUserWithGoogle = createUserWithGoogle;
exports.checkGoogleUserExists = checkGoogleUserExists;