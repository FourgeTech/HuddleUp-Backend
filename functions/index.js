const functions = require('firebase-functions');
const { createUser, createUserWithGoogle, checkGoogleUserExists, updateUserSettings, getUser, updateUser, getSettings,updateSettings, addFcmToken } = require('./src/controllers/userController');
const { createChat, addMessageToChat, loadMessages, addChatIdToUsers, getChatDetails } = require('./src/controllers/chatController');
const { createAnnouncement, deleteAnnouncement, getAnnouncements,getAnnouncementsByTeamId, updateViewCount } = require('./src/controllers/announcementController');
const firebaseAdmin = require('./src/firebaseAdmin');

const { registerTeam, updateTeam, getTeam, joinTeamByCode } = require('./src/controllers/teamController');

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
exports.addFcmToken = addFcmToken;

//Team Functions
exports.registerTeam = registerTeam;
exports.updateTeam = updateTeam;
exports.getTeam = getTeam;
exports.joinTeamByCode = joinTeamByCode;
// Firebase Functions related to chat management
exports.createChat = createChat;
exports.addMessageToChat = addMessageToChat;
exports.loadMessages = loadMessages;
exports.addChatIdToUsers = addChatIdToUsers;
exports.getChatDetails = getChatDetails;

//Create a new announcement
exports.createAnnouncement = createAnnouncement;
exports.deleteAnnouncement = deleteAnnouncement;
exports.getAnnouncements = getAnnouncements;
exports.getAnnouncementsByTeamId = getAnnouncementsByTeamId;
exports.updateViewCount = updateViewCount;
