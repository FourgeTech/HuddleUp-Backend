const functions = require('firebase-functions');
const firebaseAdmin = require('../firebaseAdmin'); 
const EventModel = require('../models/eventModel');

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

// Define the getEventsByTeamId function
exports.getEventsByTeamId = functions.https.onCall(async (data, context) => {
  const teamId = data.teamId;
  
  // Check if teamId is provided
  if (!teamId) {
      throw new functions.https.HttpsError('invalid-argument', 'Team ID must be provided');
  }

  try {
      // Query the Firestore collection for events with the given teamId
      const eventsSnapshot = await firebaseAdmin.firestore()
          .collection('events')
          .where('teamId', '==', teamId)
          .get();

      // If no events are found, return an empty list
      if (eventsSnapshot.empty) {
          return { success: true, events: [] };
      }

      // Map through the snapshot to extract data for each event
      const events = eventsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
              eventId: data.eventId,
              eventType: data.eventType,
              date: data.date,
              time: data.time,
              location: data.location,
              createdBy: data.createdBy,
              teamId: data.teamId,
              createdAt: data.createdAt
          };
      });

      // Return the list of events
      return { success: true, events };
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new functions.https.HttpsError('unknown', error.message);
  }
});