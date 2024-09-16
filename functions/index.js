const functions = require('firebase-functions');
// const { createUser } = require('./src/controllers/userController');
const admin = require('firebase-admin');
admin.initializeApp();

// exports.createUser = functions.https.onCall(createUser);

// exports.helloWorld = functions.https.onCall((data, context) => {
//     return {
//         message: 'Hello, World!'
//     };
// });

// Create a new user
exports.createUser = functions.https.onCall(async (data, context) => {
    try {
        // Create the user in Firebase Auth
        const user = await admin.auth().createUser({
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
  
  const firestore = admin.firestore();
  
  const createUserDocument = async (user, uid) => {
    const userDoc = new UserModel(user.name, user.surname, user.username, user.email, user.role);
    const plainUserModel = userDoc.plainObject;
    await firestore.collection('users').doc(uid).set(plainUserModel);
  };
  
  class UserModel {
    constructor( name, surname, username, email, role, teamIds, profilePicUrl, phoneNumber, settings) {
        this.name = name;
        this.surname = surname;
        this.username = username;
        this.email = email;
        this.role = role;
        this.teamIds = teamIds || [];
        this.profilePicUrl = profilePicUrl || '';
        this.phoneNumber = phoneNumber || '';
        this.settings = settings || {
            matchAlerts: true,
            practiceAlerts: true,
            chatNotifications: true,
            preferredLanguage: 'en',
            theme: 'light',
        };
    }
  
    get plainObject() {
      return {
        name: this.name,
        surname: this.surname,
        username: this.username,
        email: this.email,
        role: this.role,
        teamIds: this.teamIds,
        profilePicUrl: this.profilePicUrl,
        phoneNumber: this.phoneNumber,
        settings: this.settings,
      };
    }
  }