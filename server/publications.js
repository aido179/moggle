Meteor.publish("Games", function () {
    return Games.find({player:this.userId});
  });

Meteor.publish("Challenges", function () {
    var username = Meteor.users.findOne(this.userId).username;
    return Challenges.find({"players.username":username})
  });

Houston.add_collection(Meteor.users);
