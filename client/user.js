Meteor.subscribe("Games");
Meteor.subscribe("Challenges");
Meteor.subscribe("userData");

Template.user.helpers({
  games: function () {
    gamesOut = [];
    var g = Games.find({}, {$sort: {finished: -1}});
    g.forEach(function(doc) {
      gamesOut.push({
        finished: moment(doc.finished).format('ll'),
        wordCount: doc.words.length,
        score: doc.score
      });
    });
    return gamesOut.reverse();
  },
  username: function(){
    var username;
    if(Meteor.user() === undefined || Meteor.user().username === undefined){
      username = "";
    }else{
      username =  Meteor.user().username;
    }
    return username;
  },
  challenges: function(){
    return Challenges.find({});
  },
  hasPlayedChallenge: function(id){
    var c = Challenges.findOne({_id:id});
    for(i=0;i<c.players.length;i++){
      if (c.players[i].username === Meteor.user().username){
        if(c.players[i].played){
          return false;
        }
        return true;
      }
    }
  }
});

Template.user.events({
  'click .usernameUpdate': function(event){
    Meteor.call("updateUsername",$('.username').val());
  },
  'click .challengeSubmit': function(){
    Meteor.call("createChallenge",$('.chal-user').val());
  }
});
