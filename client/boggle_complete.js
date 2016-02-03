Template.boggleComplete.onRendered(function(){
  //var d = Session.get('dice');
  //console.log(d)
});

Template.boggleComplete.helpers({
  dice: function () {
    return Session.get('dice');
  },
  words: function(){
    var words = Session.get('words');
    out = []
    for (i=0;i<words.length;i++){
      out.push({
        "word": words[i],
        "score": getWordScore(words[i])
      });
    }
    return out;
  },
  score: function(){
    return getScore();
  }
});
