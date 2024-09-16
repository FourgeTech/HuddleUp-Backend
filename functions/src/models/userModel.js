class UserModel {
    constructor( name, surname, username, email, role, teamIds, profilePicUrl, phoneNumber, settings) {
        this.name = name;
        this.surname = surname;
        this.username = username;
        this.email = email;
        this.role = role;
        this.teamIds = teamIds || [];
        this.profilePicUrl = profilePicUrl || '';
        this.phoneNumber = phoneNumber || '';
        this.settings = settings || {
            matchAlerts: true,
            practiceAlerts: true,
            chatNotifications: true,
            preferredLanguage: 'en',
            theme: 'light',
        };
    }
}

module.exports = UserModel;