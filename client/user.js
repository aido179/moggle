Meteor.subscribe("Games");
Meteor.subscribe("userData");

Template.user.helpers({
  games: function () {
    gamesOut = [];
    var g = Games.find({}, {$sort: {finished: -1}});
    g.forEach(function(doc) {
      gamesOut.push({
        finished: moment(doc.finished).format('ll'),
        wordCount: doc.words.length,
        score: getScore(doc.words)
      });
    });
    return gamesOut;
  },
  username: function(){
    var username;
    if(Meteor.user() === undefined || Meteor.user().username === undefined){
      username = "";
    }else{
      username =  Meteor.user().username;
    }
    return username;
  }
});

Template.user.events({
  'click .usernameUpdate': function(event){
    Meteor.call("updateUsername",$('.username').val());
  },
  'click .challengeSubmit': function(){
    Meteor.call("challengeUser",$('.chal-user').val());
  }
});
