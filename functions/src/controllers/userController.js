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
  
exports.getUser = functions.https.onCall(async (data, context) => {
  const uid = data.uid;
  if (!uid) {
      throw new functions.https.HttpsError('invalid-argument', 'UID must be provided');
  }

  try {
      const userDoc = await firebaseAdmin.firestore().collection('users').doc(uid).get();
      if (!userDoc.exists) {
          throw new functions.https.HttpsError('not-found', 'User not found');
      }
      console.log(userDoc.data());
      return userDoc.data();
  } catch (error) {
      throw new functions.https.HttpsError('unknown', error.message);
  }
});

// Function to update a user document
exports.updateUser = functions.https.onCall(async (data, context) => {
  const uid = data.uid;
  const userData = data.userData;

  if (!uid || !userData) {
      throw new functions.https.HttpsError('invalid-argument', 'UID and user data must be provided');
  }

  try {
      await firebaseAdmin.firestore().collection('users').doc(uid).update(userData);
      return { success: true };
  } catch (error) {
      throw new functions.https.HttpsError('unknown', error.message);
  }
});

// Function to get settings for a user
exports.getSettings = functions.https.onCall(async (data, context) => {
  const uid = data.uid;
  if (!uid) {
      throw new functions.https.HttpsError('invalid-argument', 'UID must be provided');
  }

  try {
      const userDoc = await firebaseAdmin.firestore().collection('users').doc(uid).get();
      if (!userDoc.exists) {
          throw new functions.https.HttpsError('not-found', 'User not found');
      }
      
      const settings = userDoc.data()?.settings;
      if (!settings) {
          throw new functions.https.HttpsError('not-found', 'Settings not found');
      }
      
      return { settings };
  } catch (error) {
      throw new functions.https.HttpsError('unknown', error.message);
  }
});

// Function to update settings for a user
exports.updateSettings = functions.https.onCall(async (data, context) => {
  const uid = data.uid;
  const settingsData = data.settingsData;

  if (!uid || !settingsData) {
      throw new functions.https.HttpsError('invalid-argument', 'UID and settings data must be provided');
  }

  try {
      await firebaseAdmin.firestore().collection('users').doc(uid).update({
        settings: settingsData
    });
      return { success: true };
  } catch (error) {
      throw new functions.https.HttpsError('unknown', error.message);
  }
});

// Function to add FCM token to a user document
exports.addFcmToken = functions.https.onCall(async (data, context) => {
  const uid = data.uid;
  const fcmToken = data.fcmToken;

  if (!uid || !fcmToken) {
      throw new functions.https.HttpsError('invalid-argument', 'UID and FCM token must be provided');
  }

  try {
    const userDocRef = firebaseAdmin.firestore().collection('users').doc(uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'User not found');
    }

    const userData = userDoc.data();
    const fcmtokens = userData.fcmtokens || [];

    if (!fcmtokens.includes(fcmToken)) {
        fcmtokens.push(fcmToken);
        await userDocRef.update({ fcmtokens });
    }

    return { success: true };
} catch (error) {
    throw new functions.https.HttpsError('unknown', error.message);
}
});

// Trigger when a user is deleted
// exports.onUserDelete = functions.auth.user().onDelete((user) => {
//    try {
//    } catch (error) {
//    }
// });