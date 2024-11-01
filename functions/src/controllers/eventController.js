const functions = require('firebase-functions');
const firebaseAdmin = require('../firebaseAdmin'); 
const EventModel = require('../models/EventModel');

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
    
        const eventRef = await firebaseAdmin.firestore().collection("events").add(newEvent);
  
        return { success: true, id: eventRef.id };
    } catch (error) {
        console.error("Error creating event:", error);
        throw new functions.https.HttpsError("internal", "Unable to create event");
    }
  });
  
  
  // Define the getEvents function
  exports.getEvents = functions.https.onCall(async (data, context) => {
    try {
      const eventsSnapshot = await firebaseAdmin.firestore().collection("events").get();
      const events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      return { success: true, events };
    } catch (error) {
      console.error("Error fetching events:", error);
      throw new functions.https.HttpsError("internal", "Unable to fetch events");
    }
  });

