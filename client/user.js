Meteor.subscribe("Games");
Meteor.subscribe("Challenges");
Meteor.subscribe("userData");

Template.pastChallenges.helpers({
  challenges: function(){
    if(Meteor.user() != undefined && Meteor.user().username != undefined){
      return Challenges.find({
        players: {$elemMatch: {username: Meteor.user().username, played: true}}
      });
    }
  }
});

Template.openChallenges.helpers({
  challenges: function(){
    if(Meteor.user() != undefined && Meteor.user().username != undefined){
      return Challenges.find({
        players: {$elemMatch: {username: Meteor.user().username, played: false}}
      });
    }
  }
});

Template.pastGames.helpers({
  games: function () {
    gamesOut = [];
    var g = Games.find({score:{$ne:"0"}}, {sort: {created: -1}, skip:0 , limit: 15});
    g.forEach(function(doc) {
      if(doc.words==undefined){
        doc.words = [];
      }
      gamesOut.push({
        finished: moment(doc.finished).format('ll'),
        wordCount: doc.words.length,
        score: doc.score
      });
    });
    return gamesOut;
  }
});


Template.user.helpers({

  username: function(){
    var username;
    if(Meteor.user() === undefined || Meteor.user().username === undefined){
      username = "";
    }else{
      username =  Meteor.user().username;
    }
    return username;
  },
  noUsername: function(){
    if(Meteor.user() === undefined || Meteor.user().username === undefined){
      return true;
    }else{
      return false;
    }
  }
});

Template.user.events({
  'click .usernameUpdate': function(event){
    $('.usernameUpdate').text("Updating...");
    $('.usernameUpdate').prop( "disabled", true );
    Meteor.call("updateUsername",$('.username').val(), function(err, res){
      if(err){
        $('.usernameUpdate').text("Try again!");
        $('.usernameUpdate').prop( "disabled", false );
      }else{
        $('.usernameUpdate').text("Done!");
        $('.usernameUpdate').prop( "disabled", false );
      }
    });
  },
  'click .challengeSubmit': function(){
    $('.challengeSubmit').text("Creating...");
    $('.challengeSubmit').prop( "disabled", true );
    Meteor.call("createChallenge",$('.chal-user').val(), function(err, result){
      if(err){
        $('.challengeSubmit').text(err.reason+" Please try again.");
        $('.challengeSubmit').prop( "disabled", false );
      }else{
        $('.challengeSubmit').text("Done!");
        $('.challengeSubmit').prop( "disabled", false );
      }
    });
    event.preventDefault();
  },
  'submit .username-form-form': function(event){
    $('.usernameUpdate').text("Updating...");
    $('.usernameUpdate').prop( "disabled", true );
    Meteor.call("updateUsername",$('.username').val(), function(err, res){
      if(err){
        $('.usernameUpdate').text("Try again!");
        $('.usernameUpdate').prop( "disabled", false );
      }else{
        $('.usernameUpdate').text("Done!");
        $('.usernameUpdate').prop( "disabled", false );
      }
    });
    event.preventDefault();
  },
  'submit .challenge-form-form': function(err, res){
    event.preventDefault();
    $('.challengeSubmit').text("Creating...");
    $('.challengeSubmit').prop( "disabled", true );
    Meteor.call("createChallenge",$('.chal-user').val(), function(err, res){
      if(err){
        $('.challengeSubmit').text(err.reason+" Please try again.");
        $('.challengeSubmit').prop( "disabled", false );
      }else{
        $('.challengeSubmit').text("Done!");
        $('.challengeSubmit').prop( "disabled", false );
      }
    });
  },
  'click .challenge_user': function(event){
    var uid = $(event.currentTarget).data("user");
    var hash = $(event.currentTarget).data("hash");
    Meteor.call("getUserGame", uid, hash, function(err, res){
      var out = "Words:\n"
      for (i=0;i<res.length;i++){
        out+=res[i].word+" ("+res[i].score+")\n";
      }
      alert(out);
    });
  }
});
