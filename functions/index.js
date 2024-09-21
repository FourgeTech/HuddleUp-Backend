const functions = require('firebase-functions');
const { createUser, createUserWithGoogle, checkGoogleUserExists, updateUserSettings, getUser, updateUser, getSettings,updateSettings } = require('./src/controllers/userController');
const { createChat, addMessageToChat, loadMessages, addChatIdToUsers, getChatDetails } = require('./src/controllers/chatController');
const firebaseAdmin = require('./src/firebaseAdmin');

// exports.helloWorld = functions.https.onCall((data, context) => {
//     return {
//         message: 'Hello, World!'
//     };
// });

// Firebase Functions related to user management
exports.createUser = createUser;
exports.createUserWithGoogle = createUserWithGoogle;
exports.checkGoogleUserExists = checkGoogleUserExists;
exports.updateUserSettings = updateUserSettings;
exports.getUser = getUser;
exports.updateUser = updateUser;
exports.updateSettings = updateSettings;
exports.getSettings = getSettings;

// Firebase Functions related to chat management
exports.createChat = createChat;
exports.addMessageToChat = addMessageToChat;
exports.loadMessages = loadMessages;
exports.addChatIdToUsers = addChatIdToUsers;
exports.getChatDetails = getChatDetails;