const functions = require('firebase-functions');
const firebaseAdmin = require('../firebaseAdmin');

// Create a new announcement (no admin check)
exports.createAnnouncement = functions.https.onCall(async (data, context) => {
    try {
        const announcementData = {
            announcementId: data.announcementId,
            teamId: data.teamId,
            title: data.title,
            message: data.message,
            createdBy: data.createdBy,
            createdAt: data.createdAt,
            viewCount: 0,
        };

        // Add the announcement to the Firestore collection
        await firebaseAdmin.firestore().collection('announcements').doc(data.announcementId).set(announcementData);

        // Send a success response with announcement details
        return {
            status: 'success',
            message: 'Announcement successfully created.',
            announcementId: data.announcementId,
        };
    } catch (error) {
        console.error('Error creating announcement:', error);

        // Send an error response
        return {
            status: 'error',
            message: error.message || 'An error occurred while creating the announcement.',
            code: error.code || 500,
        };
    }
});

// Delete an announcement (no admin check)
exports.deleteAnnouncement = functions.https.onCall(async (data, context) => {
    try {
        const announcementId = data.announcementId;
        if (!announcementId) {
            throw new functions.https.HttpsError('invalid-argument', 'Announcement ID must be provided');
        }

        await firebaseAdmin.firestore().collection('announcements').doc(announcementId).delete();
        return { status: 'success', message: 'Announcement successfully deleted.' };
    } catch (error) {
        console.error('Error deleting announcement:', error);

        throw new functions.https.HttpsError('unknown', error.message);
    }
});

// Get an announcement by ID (no admin check required)
exports.getAnnouncement = functions.https.onCall(async (data, context) => {
    const announcementId = data.announcementId;
    if (!announcementId) {
        throw new functions.https.HttpsError('invalid-argument', 'Announcement ID must be provided');
    }

    try {
        const announcementDoc = await firebaseAdmin.firestore().collection('announcements').doc(announcementId).get();
        if (!announcementDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Announcement not found');
        }

        // Send the announcement data
        return announcementDoc.data();
    } catch (error) {
        throw new functions.https.HttpsError('unknown', error.message);
    }
});

// Get announcements by teamId
exports.getAnnouncementsByTeamId = functions.https.onCall(async (data, context) => {
    const teamId = data.teamId;
    
    // Check if teamId is provided
    if (!teamId) {
        throw new functions.https.HttpsError('invalid-argument', 'Team ID must be provided');
    }

    try {
        // Query the Firestore collection for announcements with the given teamId
        const announcementsSnapshot = await firebaseAdmin.firestore()
            .collection('announcements')
            .where('teamId', '==', teamId)
            .get();

        // If no announcements are found, return an empty list
        if (announcementsSnapshot.empty) {
            return [];
        }

        // Map through the snapshot to extract data for each announcement
        const announcements = announcementsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                announcementId: data.announcementId,
                teamId: data.teamId,
                title: data.title,
                message: data.message,
                createdBy: data.createdBy,
                createdAt: data.createdAt,
                viewCount: data.viewCount
            };
        });

        // Return the list of announcements
        return announcements;
    } catch (error) {
        console.error('Error fetching announcements:', error);
        throw new functions.https.HttpsError('unknown', error.message);
    }
});

// Update the view count of an announcement (no admin check required)
exports.updateViewCount = functions.https.onCall(async (data, context) => {
    const announcementId = data.announcementId;
    if (!announcementId) {
        throw new functions.https.HttpsError('invalid-argument', 'Announcement ID must be provided');
    }

    try {
        const announcementRef = firebaseAdmin.firestore().collection('announcements').doc(announcementId);
        await announcementRef.update({
            viewCount: firebaseAdmin.firestore.FieldValue.increment(1),
        });
        return { status: 'success', message: 'View count updated.' };
    } catch (error) {
        throw new functions.https.HttpsError('unknown', error.message);
    }
});
