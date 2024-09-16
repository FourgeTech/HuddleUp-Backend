const functions = require('firebase-functions');
const firebaseAdmin = require('../firebaseAdmin');
const {createUserDocument} = require('../services/userService');

// Create a new user
exports.createUser = functions.https.onCall(async (data, context) => {
    try {
        // Create the user in Firebase Auth
        const user = await firebaseAdmin.auth().createUser({
            email: data.email,
            password: data.password,
        });

        // Create the Firestore document for the user
        await createUserDocument(data, user.uid);

        // Send a success response with user details
        return {
            status: 'success',
            message: 'User successfully created.',
            uid: user.uid,
            email: user.email
        };
    } catch (error) {
        // Log the error
        console.error('Error creating user:', error);

        // Send an error response
        return {
            status: 'error',
            message: error.message || 'An error occurred while creating the user.',
            code: error.code || 500
        };
    }
});

exports.createUserWithGoogle = functions.https.onCall(async (data, context) => {
    try {
      // Check if user already exists in Firestore
      const userDocRef = firebaseAdmin.firestore().collection('users').doc(data.uid);
      const userDoc = await userDocRef.get();
  
      if (!userDoc.exists) {
        await createUserDocument(data, data.uid);
      }
  
      // Send a success response
      return {
        status: 'success',
        message: 'User successfully signed in with Google.',
      };
    } catch (error) {
      console.error('Error verifying Google token or creating user:', error);
      return {
        status: 'error',
        message: error.message || 'An error occurred while verifying the Google ID token.',
        code: error.code || 500,
      };
    }
  });
  
// Trigger when a user is deleted
// exports.onUserDelete = functions.auth.user().onDelete((user) => {
//    try {
//    } catch (error) {
//    }
// });