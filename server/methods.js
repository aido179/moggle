Meteor.methods({
  addGame: function (data) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Games.insert({
      player: Meteor.userId(),
      finished: new Date(),
      hash: data["gameHash"],
      words: data["words"]
    });
  },
  checkGame: function(gameHash){
    return !!Games.find({player:Meteor.userId(), hash:gameHash}).count();
  },
  updateUsername: function(username){
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Accounts.setUsername(Meteor.userId(), username);
  }
});
