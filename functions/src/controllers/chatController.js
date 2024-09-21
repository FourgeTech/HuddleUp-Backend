const functions = require("firebase-functions");
const firebaseAdmin = require('../firebaseAdmin');
const firestore = firebaseAdmin.firestore();

const {
  createChatDocument,
  createChatMessageDocument,
  addChatIdToUsers,
  getChatDetails,
} = require("../services/chatService");

// Firebase Function to create a new chat room
exports.createChat = functions.https.onCall(async (data, context) => {
  const { chatName, type, description, members, teamId } = data;

  try {
    // Call the createChatDocument function
    const chatId = await createChatDocument(chatName, type, description, members, teamId);

    // Return success with the chat room ID
    return {
      status: "success",
      message: "Chat room created successfully.",
      chatId: chatId,
    };
  } catch (error) {
    console.error("Error creating chat room:", error);
    return {
      status: "error",
      message: "Failed to create chat room.",
    };
  }
});

// Function to add a message to a chat room's messages subcollection
exports.addMessageToChat = functions.https.onCall(async (data, context) => {
  const { chatId, message } = data;
  try {
    // Save the message to the 'messages' subcollection of the chat
    const messageRef = createChatMessageDocument(chatId, message);

    // Return the message document ID for reference
    return {
      status: "success",
      message: messageRef.id,
    };
  } catch (error) {
    console.error("Error creating chat room:", error);
    return {
      status: "error",
      message: "Failed to create chat room.",
    };
  }
});

// Load chat messages
exports.loadMessages = functions.https.onCall(async (data, context) => {
  try {
      const { chatId, limit = data.limit || 20, lastMessageTimestamp } = data;

      // Validate data
      if (!chatId) {
          throw new functions.https.HttpsError('invalid-argument', 'Chat ID is required');
      }

      // Build query
      let messagesQuery = firestore.collection('chats').doc(chatId).collection('messages');

      // // Apply limit (optional)
      // if (limit) {
      //     messagesQuery = messagesQuery.limit(limit);
      // }

      // // If there's a last message timestamp, paginate from that point
      // if (lastMessageTimestamp) {
      //     messagesQuery = messagesQuery.startAfter(lastMessageTimestamp);
      // }

      // Get messages from Firestore
      const snapshot = await messagesQuery.orderBy("timestamp", "asc").get();
      const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.info('Loaded messages:', messages);

      // Return the messages
      return {
          status: 'success',
          messages
      };
  } catch (error) {
      console.error('Error loading messages:', error);
      return {
          status: 'error',
          message: error.message || 'An error occurred while loading messages.',
          code: error.code || 500
      };
  }
});

exports.addChatIdToUsers = functions.https.onCall(async(data, context) => {
  try {
      addChatIdToUsers(data);
  } catch (error) {
    console.error('Error adding chatId to users:', error);
    return {
      status: 'error',
      message: error.message || 'An error occurred while adding chatId to users.',
      code: error.code || 500,
    };
  }
});

exports.getChatDetails = functions.https.onCall(async (data, context) => {
  try {
    const result = await getChatDetails(data.userId);
    return {
      status: 'success',
      messages: result,
    };
} catch (error) {
  console.error('Error adding chatId to users:', error);
  return {
    status: 'error',
    message: error.message || 'An error occurred while adding chatId to users.',
    code: error.code || 500,
  };
}
});
