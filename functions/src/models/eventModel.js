class EventModel {
    constructor(eventId = "", eventType = "", date = "", time = "", location = "", createdBy = "", teamId = "") {
        this.eventId = eventId;
        this.eventType = eventType;  // "Match" or "Practice"
        this.date = date;            // Format: "YYYY-MM-DD"
        this.time = time;            // Format: "HH:mm"
        this.location = location;
        this.createdBy = createdBy;  // Manager's UID
        this.teamId = teamId;        // To associate with a specific team
    }

    // Convert EventModel to a Map
    toMap() {
        return {
            eventId: this.eventId,
            eventType: this.eventType,
            date: this.date,
            time: this.time,
            location: this.location,
            createdBy: this.createdBy,
            teamId: this.teamId
        };
    }

    // Create EventModel from a Map
    static fromMap(map) {
        return new EventModel(
            map.eventId || "",
            map.eventType || "",
            map.date || "",
            map.time || "",
            map.location || "",
            map.createdBy || "",
            map.teamId || ""
        );
    }
}

module.exports = EventModel;