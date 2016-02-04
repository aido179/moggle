Template.boggleComplete.onRendered(function(){
  //var d = Session.get('dice');
  //console.log(d)
  var words = Session.get('words');
  Session.setDefault('verified', []);
  Session.setDefault('unverified', []);
  Meteor.call("checkWords", words, function(err, res){
    for(i=0;i<res.length;i++){
      if(res[i].exists){
        var v = Session.get('verified');
        v.push(res[i].word);
        Session.set('verified',v);
      }else{
        var v = Session.get('unverified');
        v.push(res[i].word);
        Session.set('unverified',v);
      }
    }
  });
});

Template.boggleComplete.helpers({
  dice: function () {
    return Session.get('dice');
  },
  words: function(){
    var words = Session.get('verified');
    out = []
    for (i=0;i<words.length;i++){
      out.push({
        "word": words[i],
        "score": getWordScore(words[i])
      });
    }
    return out;
  },
  unverifiedWords: function(){
    return Session.get('unverified');
  },
  score: function(){
    return getScore();
  }
});
