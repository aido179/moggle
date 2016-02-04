Session.setDefault('verified', []);
Session.setDefault('unverified', []);
Session.setDefault('score', 0);
Session.setDefault('scoreLoaded', false);
var params;

Template.boggleComplete.onRendered(function(){
  //get params
  params = Iron.controller().getParams();
  //Calculate score
  Session.set('verified', []);
  Session.set('unverified', []);
  Session.set('scoreLoaded', false);
  var words = Session.get('words');
  Meteor.call("checkWords", words, function(err, res){
    for(i=0;i<res.length;i++){
      //check the word's existance
      if(res[i].exists){
        var v = Session.get('verified');
        //check the word has not been found more than once.
        if(v.indexOf(res[i].word) === -1){
          v.push(res[i].word);
          Session.set('verified',v);
        }
      }else{
        var v = Session.get('unverified');
        v.push(res[i].word);
        Session.set('unverified',v);
      }
    }
    var score = getScore();
    Session.set('score', score);
    Session.set('scoreLoaded', true);

    //store challenge
    if(params.chal_id != undefined){
      Meteor.call("completeChallenge", params.chal_id, score);
    }
    //store user score
    var hash = getGameHash(Session.get('dice'));
    Meteor.call("updateScore", hash, score);
  });

});

Template.boggleComplete.helpers({
  dice: function () {
    return Session.get('dice');
  },
  words: function(){
    var words = Session.get('verified');
    if(words!=undefined){
      out = []
      for (i=0;i<words.length;i++){
        out.push({
          "word": words[i],
          "score": getWordScore(words[i])
        });
      }
      return out;
    }else{
      return [];
    }

  },
  unverifiedWords: function(){
    return Session.get('unverified');
  },
  score: function(){
    return Session.get('score');
  },
  scoreLoaded: function(){
    return Session.get('scoreLoaded');
  }
});
