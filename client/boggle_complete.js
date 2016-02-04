Session.setDefault('verified', []);
Session.setDefault('unverified', []);
Session.setDefault('score', 0);

Template.boggleComplete.onRendered(function(){
  //var d = Session.get('dice');
  //console.log(d)
  var words = Session.get('words');
  Session.set('verified', []);
  Session.set('unverified', []);

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
    Session.set('score', getScore());
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
  }
});
