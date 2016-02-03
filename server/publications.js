Meteor.publish("Games", function () {
    return Games.find({player:this.userId});
  });

Houston.add_collection(Meteor.users);
