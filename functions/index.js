const functions = require('firebase-functions');
const { createUser, createUserWithGoogle, checkGoogleUserExists, updateUserSettings, getUser, updateUser, getSettings,updateSettings } = require('./src/controllers/userController');
const { createAnnouncement, deleteAnnouncement, getAnnouncements,getAnnouncementsByTeamId, updateViewCount } = require('./src/controllers/announcementController');
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
exports.updateUserSettings = updateUserSettings;
exports.getUser = getUser;
exports.updateUser = updateUser;
exports.updateSettings = updateSettings;
exports.getSettings = getSettings;

//Create a new announcement
exports.createAnnouncement = createAnnouncement;
exports.deleteAnnouncement = deleteAnnouncement;
exports.getAnnouncements = getAnnouncements;
exports.getAnnouncementsByTeamId = getAnnouncementsByTeamId;
exports.updateViewCount = updateViewCount;