const firebaseAdmin = require('../firebaseAdmin');
const UserModel = require('../models/userModel');
const firestore = firebaseAdmin.firestore();
  
  const createUserDocument = async (user, uid) => {
    const userDoc = new UserModel(user.name, user.surname, user.username, user.email, user.role);
    const plainUserModel = userDoc.plainObject;
    await firestore.collection('users').doc(uid).set(plainUserModel);
  };

// Export the function
module.exports = {
    createUserDocument,
};