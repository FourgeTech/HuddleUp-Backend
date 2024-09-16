const functions = require('firebase-functions');
const admin = require('../firebaseAdmin');
const {userService} = require('../services/userService');

// Create a new user
exports.createUser = functions.https.onCall(async (data, context) => {
    try {
        // Create the user in Firebase Auth
        const user = await admin.auth().createUser({
            email: data.email,
            password: data.password,
        });

        // Create the Firestore document for the user
        await userService.createUserDocument(data, user.uid);

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

// Trigger when a user is deleted
// exports.onUserDelete = functions.auth.user().onDelete((user) => {
//    try {

    
//    } catch (error) {
    
//    }
// });