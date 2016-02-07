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
    return Games.findOne({hash: getGameHash(Session.get('dice')), player:Meteor.userId()})
  },
  score: function(){
    return Session.get('score');
  },
  challenge: function(){
    //Challenges.findOne({_id:Session.get('chal_id')})
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
  }
});
