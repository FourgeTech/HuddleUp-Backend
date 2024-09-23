class TeamModel {
    constructor(teamName, teamCode, location, league, createdBy, members, managers, players, events) {
        this.teamName = teamName || '';
        this.teamCode = teamCode || '';
        this.location = location || '';
        this.league = league || '';
        this.createdBy = createdBy || '';
        this.members = members || {};
        this.managers = managers || [];
        this.players = players || [];
        this.events = events || [];
    }

    get plainObject() {
        return {
            teamName: this.teamName,
            teamCode: this.teamCode,
            location: this.location,
            league: this.league,
            createdBy: this.createdBy,
            members: this.members,
            managers: this.managers,
            players: this.players,
            events: this.events,
        };
    }
}

module.exports = TeamModel;