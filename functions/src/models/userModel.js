class UserModel {
    constructor( name, surname, username, email, role, teamIds, profilePicUrl, phoneNumber, settings) {
        this.name = name || '';
        this.surname = surname || '';
        this.username = username;
        this.email = email || '';
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
  
    get plainObject() {
      return {
        name: this.name,
        surname: this.surname,
        username: this.username,
        email: this.email,
        role: this.role,
        teamIds: this.teamIds,
        profilePicUrl: this.profilePicUrl,
        phoneNumber: this.phoneNumber,
        settings: this.settings,
      };
    }
  }

module.exports = UserModel;