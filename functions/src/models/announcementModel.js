class AnnouncementModel {
    constructor(announcementId, teamId, title, message, createdBy, createdAt, viewCount) {
        this.announcementId = announcementId;
        this.teamId = teamId;
        this.title = title;
        this.message = message;
        this.createdBy = createdBy;
        this.createdAt = createdAt || new Date(); // Defaults to current timestamp if not provided
        this.viewCount = viewCount || 0; // Defaults to 0 if not provided
    }

    get plainObject() {
        return {
            announcementId: this.announcementId,
            teamId: this.teamId,
            title: this.title,
            message: this.message,
            createdBy: this.createdBy,
            createdAt: this.createdAt,
            viewCount: this.viewCount,
        };
    }
}

module.exports = AnnouncementModel;
