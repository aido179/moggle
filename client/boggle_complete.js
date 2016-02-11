Session.setDefault('score', 0);
Session.setDefault('chal_id', 0);

Template.boggleComplete.onRendered(function(){
    //get params
    if(Session.get('isChallenge')){
      params = Iron.controller().getParams();
      Session.set('chal_id', params.chal_id);
    }

});

Template.boggleComplete.helpers({
  dice: function () {
    return Session.get('dice');
  },
  game: function(){
    var g = Games.findOne({hash: getGameHash(Session.get('dice')), player:Meteor.userId()});
    if(g === undefined){
      return {words: Session.get('words_scores')};
    }else{
      return g
    }
  },
  score: function(){
    return Session.get('score');
  },
  discarded: function(){
    return Session.get('discarded');
  },
  challenge: function(){
    return Challenges.findOne({_id:Session.get('chal_id')});
  },
  isChallenge: function(){
    return Session.get('isChallenge');
  }
});

Template.boggleComplete.events({
  'click .playagain': function(event){
    // Make sure we don't go back to a challenge...
    if(Session.get('isChallenge')){
      Router.go("boggle");
    }else{
      newGameSession();
    }
  },
  'click .checkedWord': function(event){
    //don't allow clicking twice
    $(event.currentTarget).removeClass("checkedWord");
    //get the word and define it
    var defword = $(event.currentTarget).data('word');
    $(event.currentTarget).append("<p class='list-group-item-text'></p>")
    $(event.currentTarget).find('p').text("Loading...");
    var def = Meteor.call("defineWord", defword, function(err, res){
      if(err){
        console.log(err);
        $(event.currentTarget).find('p').text("An error occured.");
      }else{
        $(event.currentTarget).find('p').html("[<i>"+res.part+"</i>] "+res.text);
      }
    });
  }
});
