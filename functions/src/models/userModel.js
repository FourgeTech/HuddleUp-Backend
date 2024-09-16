class UserModel {
    constructor( firstname, lastname, username, email, role, teamIds, profilePicUrl, phoneNumber, settings) {
        this.firstname = firstname || '';
        this.lastname = lastname || '';
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
        firstname: this.firstname,
        lastname: this.lastname,
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