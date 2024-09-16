const admin = require('../firebaseAdmin');
const UserModel = require('../models/userModel');
const firestore = admin.firestore();

const createUserDocument = async (user, uid) => {
    const userDoc = new UserModel(user.name, user.surname, user.username, user.email, user.role);
    await firestore.collection('users').doc(uid).set(userDoc);
};

// Export the function
module.exports = {
    createUserDocument,
};