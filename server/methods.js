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
  },
  checkWords: function(wordsArr){
    var out = [];
    for(i=0;i<wordsArr.length;i++){
      if (!!Dictionary.find({word:wordsArr[i].toLowerCase()}).count()){
        out.push({
          word: wordsArr[i],
          exists: true
        });
      }else{
        out.push({
          word: wordsArr[i],
          exists: false
        });
      }
    }
    return out;
  },
  createChallenge: function(usersString){
    //usersString is the string the user wrote with usernames.
    var users = usersString.split(", ");
    var checkedUsers = [];
    var checkedUsernames = [];
    for(i=0;i<users.length;i++){
      //make sure usernames exist and are not duplicated.
      if((!!Meteor.users.find({username: users[i]}).count()) && checkedUsernames.indexOf(users[i]) == -1){
        checkedUsers.push({username: users[i], played:false});
        checkedUsernames.push(users[i]);
      }
    }
    //make sure the user creating the challenge is included.
    if(checkedUsers.indexOf(Meteor.user().username) == -1){
      checkedUsers.push({username: Meteor.user().username, played:false});
    }

    //get a game hash for the challenge.
    var game = getGameHash(getGame());
    //insert the challenge
    Challenges.insert({
      players: checkedUsers,
      hash: game
    });
  }
});
