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

  exports.updateUserSettings = functions.https.onCall(async (data, context) => {
    // Ensure the user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The user must be authenticated to update settings.');
    }

    const uid = context.auth.uid;
    const { firstname, lastname, profilePicUrl, settings } = data;

    // Prepare the update data
    const updateData = {};
    if (firstname !== undefined) updateData.firstname = firstname;
    if (lastname !== undefined) updateData.lastname = lastname;
    if (profilePicUrl !== undefined) updateData.profilePicUrl = profilePicUrl;
    if (settings !== undefined) updateData.settings = settings;

    try {
        // Update the user's settings in Firestore
        await firebaseAdmin.firestore().collection('users').doc(uid).update(updateData);
        return { success: true };
    } catch (error) {
        console.error('Error updating user settings:', error);
        throw new functions.https.HttpsError('unknown', 'Error updating user settings.');
    }
});
  
// Trigger when a user is deleted
// exports.onUserDelete = functions.auth.user().onDelete((user) => {
//    try {
//    } catch (error) {
//    }
// });