const { ChatMessageModel, ChatModel } = require("../models/chatModels");
const firebaseAdmin = require("../firebaseAdmin");
const firestore = firebaseAdmin.firestore();
const {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} = require("firebase-admin/firestore");

// Function to create a chat document in Firestore
const createChatDocument = async (
  chatName,
  type,
  description,
  members,
  teamId
) => {
  try {
    // Create a new ChatModel instance
    const chatDoc = new ChatModel(chatName, type, description, members, teamId);

    // Convert to plain object to save in Firestore
    const plainChatModel = chatDoc.plainObject;

    // Save to Firestore under 'chats' collection
    const chatRef = await firestore.collection("chats").add(plainChatModel);

    // Return the document ID for reference
    return chatRef.id;
  } catch (error) {
    console.error("Error creating chat document:", error);
    throw new Error("Could not create chat document");
  }
};

const createChatMessageDocument = async (chatId, message) => {
  const { senderId, sender, content, teamId } = message;
  try {
    // Create a new ChatMessageModel instance
    const messageDoc = new ChatMessageModel(senderId, sender, content, teamId);

    // Convert to plain object to save in Firestore
    const plainMessageModel = messageDoc.plainObject;

    // Save the message to the 'messages' subcollection of the chat
    const messageRef = await firestore
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .add(plainMessageModel);

    // Return the message document ID for reference
    return messageRef.id;
  } catch (error) {
    console.error("Error adding message to chat:", error);
    throw new Error("Could not add message to chat.");
  }
};

const addChatIdToUsers = async (data) => {
  const { userIds = null, chatId } = data;
  console.error("Here is the chatId:", chatId);
  if (!data) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with a data object containing userIds and chatId."
    );
  }

  if (!chatId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with a chatId."
    );
  }
  const batch = firestore.batch();

  if (!userIds) {
    // Fetch all users if userIds list is empty
    const usersSnapshot = await firestore.collection("users").get();

    usersSnapshot.forEach((doc) => {
      const userRef = firestore.collection("users").doc(doc.id);
      batch.update(userRef, {
        chatIds: FieldValue.arrayUnion(chatId),
      });
    });
  } else {
    userIds.forEach((userId) => {
      const userRef = firestore.collection("users").doc(userId);
      batch.update(userRef, {
        chatIds: FieldValue.arrayUnion(chatId),
      });
    });
  }
  try {
    await batch.commit();
    return { 
      result: "Successfully updated users with new chatId"
     };
  } catch (error) {
    throw new functions.https.HttpsError(
      "internal",
      "Failed to update users",
      error
    );
  }
};

const getChatDetails = async (userId) => {
  if (!userId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with a list of chat document IDs."
    );
  }

  const userDoc = await firestore.collection("users").doc(userId).get();

  if (!userDoc.exists) {
    throw new functions.https.HttpsError(
      "not-found",
      `User document with ID ${userId} does not exist.`
    );
  }

  const userData = userDoc.data();
  const chatIds = userData.chatIds || [];

  const chatDetails = [];
  
  for (const chatId of chatIds) {
    const chatDocRef = firestore.collection("chats").doc(chatId);
    const chatDoc = await chatDocRef.get();
    if (chatDoc.exists) {
      const chatData = chatDoc.data();
      chatData.chatId = chatId;
      chatDetails.push(chatData);
    } else {
      console.warn(`Chat document with ID ${chatId} does not exist.`);
    }
  }

  console.error("Here is the chatDetails:", chatDetails);
  return chatDetails;
};

// Export the function
module.exports = {
  addChatIdToUsers,
  createChatDocument,
  createChatMessageDocument,
  getChatDetails,
};
