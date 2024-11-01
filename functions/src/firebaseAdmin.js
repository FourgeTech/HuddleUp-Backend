const admin = require('firebase-admin');

// Use emulators if running in the local environment
if (process.env.FUNCTIONS_EMULATOR) {
    // Firestore emulator
    process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
  
    // Firebase Auth emulator
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
  }

// Initialize Firebase Admin
if (process.env.NODE_ENV !== 'test') {
  const serviceAccount = require('../serviceAccount.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  admin.initializeApp();
}

// Define the addEvent function
exports.addEvent = functions.https.onCall(async (data, context) => {
  const { eventId, eventType, date, time, location, createdBy, teamId } = data;

  try {
      const newEvent = new EventModel(
          eventId,
          eventType,
          date,
          time,
          location,
          createdBy,
          teamId
      ).toMap();

      newEvent.createdAt = admin.firestore.FieldValue.serverTimestamp();

      const eventRef = await admin.firestore().collection("events").add(newEvent);

      return { success: true, id: eventRef.id };
  } catch (error) {
      console.error("Error creating event:", error);
      throw new functions.https.HttpsError("internal", "Unable to create event");
  }
});


// Define the getEvents function
exports.getEvents = functions.https.onCall(async (data, context) => {
  try {
    const eventsSnapshot = await admin.firestore().collection("events").get();
    const events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return { success: true, events };
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new functions.https.HttpsError("internal", "Unable to fetch events");
  }
});

module.exports = admin;