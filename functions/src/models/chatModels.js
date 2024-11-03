class ChatModel {
    constructor(chatName, type, description, members, teamId) {
      this.chatName = chatName;
      this.type = type;
      this.description = description || '';          
      this.members = members || [];      
      this.teamId = teamId || null; 
      this.createdAt = new Date().toISOString(); 
    }
  
    // Convert to plain object for Firestore
    get plainObject() {
      return {
        chatName: this.chatName,
        type: this.type,
        description: this.description,
        members: this.members,
        teamId: this.teamId,
        createdAt: this.createdAt,
      };
    }
  }

  // Convert to plain object for Firestore
  class ChatMessageModel {
    constructor(senderId, sender, content, teamId) {
      this.senderId = senderId;
      this.sender = sender;   
      this.content = content;     
      this.timestamp = new Date().toISOString();  
      this.teamId = teamId;
    }
  
    get plainObject() {
      return {
        senderId: this.senderId,
        sender: this.sender,
        content: this.content,
        timestamp: this.timestamp,
        teamId: this.teamId,
      };
    }
  }
  
  module.exports = {
    ChatModel,
    ChatMessageModel,
  };