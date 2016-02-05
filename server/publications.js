Meteor.publish("Games", function () {
  if(this.userId != undefined){
    return Games.find({player:this.userId});
  }
});

Meteor.publish("Challenges", function () {
  if(this.userId != undefined){
    var username = Meteor.users.findOne(this.userId).username;
    return Challenges.find({"players.username":username})
  }
});

Houston.add_collection(Meteor.users);
