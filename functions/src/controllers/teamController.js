const functions = require('firebase-functions');
const firebaseAdmin = require('../firebaseAdmin');
const {
    getFirestore,
    Timestamp,
    FieldValue,
    Filter,
  } = require("firebase-admin/firestore");
const { user } = require('firebase-functions/v1/auth');

exports.registerTeam = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User not authenticated.');
    }

    const { teamId, teamName, teamCode, location, league, createdBy, members, managers, players, events } = data;
    const userId = context.auth.uid;
    try {
        await firebaseAdmin.firestore().collection('teams').doc(teamId).set({
            teamName,
            teamCode,
            location,
            league,
            createdBy,
            members,
            managers,
            players,
            events,
        });

        await firebaseAdmin.firestore().collection('users').doc(userId).update({
            teamIds: FieldValue.arrayUnion(teamId),
        });

        return { 
            status: 'success', 
            message: 'Team created successfully.',
            teamCode: teamCode, };
    } catch (error) {
        console.error('Error creating team:', error);
        throw new functions.https.HttpsError('internal', 'Failed to create team.');
    }
});

exports.updateTeam = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User not authenticated.');
    }

    const { teamId, teamData } = data;

    try {
        await firebaseAdmin.firestore().collection('teams').doc(teamId).update(teamData);
        return true;
    } catch (error) {
        console.error('Error updating team:', error);
        throw new functions.https.HttpsError('internal', 'Failed to update team.');
    }
});

exports.getTeam = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User not authenticated.');
    }

    const { teamId } = data;

    try {
        const teamDoc = await firebaseAdmin.firestore().collection('teams').doc(teamId).get();
        if (!teamDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Team not found.');
        }
        return teamDoc.data();
    } catch (error) {
        console.error('Error fetching team:', error);
        throw new functions.https.HttpsError('internal', 'Failed to get team.');
    }
});

exports.joinTeamByCode = functions.https.onCall(async (data, context) => {
    const teamCode = data.teamCode;
    const userId = data.userId;
  
    if (!userId) {
      throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
    }
  
    try {
      // Get the team using the team code
      const teamSnapshot = await firebaseAdmin.firestore().collection('teams').where('teamCode', '==', teamCode).limit(1).get();
      
      if (teamSnapshot.empty) {
        return { status: 'error', message: 'Team not found' };
      }
  
      const teamDoc = teamSnapshot.docs[0];
      const teamData = teamDoc.data();
  
      // Add the user to the team
      const members = teamData.members || {};
      members[userId] = 'Player'; // Assign role "Player" to the user

      // Add the user to the players array
      await firebaseAdmin.firestore().collection('teams').doc(teamDoc.id).update({
        players: FieldValue.arrayUnion(userId)});

        // Update the user document with the new team
      await firebaseAdmin.firestore().collection('users').doc(userId).update({
        teamIds: FieldValue.arrayUnion(teamDoc.id)});
  
      // Update the team document with the new member
      await teamDoc.ref.update({ members });

  
      return { status: 'success', message: 'Joined team successfully' };
    } catch (error) {
      console.error('Error joining team:', error);
      throw new functions.https.HttpsError('unknown', 'Failed to join team');
    }
  });

exports.getTeamPlayers = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User not authenticated.');
    }

    const { teamId } = data;

    try {
        const teamDoc = await firebaseAdmin.firestore().collection('teams').doc(teamId).get();
        if (!teamDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Team not found.');
        }

        const teamData = teamDoc.data();
        const playerIds = teamData.players || [];

        if (playerIds.length === 0) {
            return { status: 'success', players: [] };
        }

        const playerDocs = await firebaseAdmin.firestore().collection('users').where(firebaseAdmin.firestore.FieldPath.documentId(), 'in', playerIds).get();
        const players = playerDocs.docs.map(doc => {
            const userData = doc.data();
            return `${userData.firstName} ${userData.lastName}`;
        });

        return { status: 'success', players };
    } catch (error) {
        console.error('Error fetching team players:', error);
        throw new functions.https.HttpsError('internal', 'Failed to get team players.');
    }
});


