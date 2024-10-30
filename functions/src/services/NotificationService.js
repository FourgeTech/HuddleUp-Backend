const firebaseAdmin = require("../firebaseAdmin");

class NotificationService {
    static async sendNotification(tokens, title, message) {
        if (!tokens || tokens.length === 0) {
            console.log("No tokens provided for notification.");
            return;
        }

        const messagePayload = {
            tokens: tokens,
            notification: {
                title: title,
                body: message,
            },
        };

        try {
            const response = await firebaseAdmin.messaging().sendEachForMulticast(messagePayload);
            console.log("Notification sent successfully:", response);

            response.results.forEach((result, index) => {
                if (result.error) {
                    console.error(`Error sending to token ${tokens[index]}:`, result.error);
                }
            });
        } catch (error) {
            console.error("Error sending notification:", error);
        }
    }
}


module.exports = NotificationService;
