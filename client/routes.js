Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('home');
});

Router.route('/challenge/:chal_id', function(){
  // add the subscription handle to our waitlist
    this.wait(Meteor.subscribe('Challenges'));
    // this.ready() is true if all items in the wait list are ready
    if (this.ready()) {
      var chal_id = this.params.chal_id;
      var c = Challenges.findOne({_id:chal_id});
      //make sure user has not yet played this challenge
      var hasPlayed = false;
      for(i=0;i<c.players.length;i++){
        if (c.players[i].username === Meteor.user().username){
          if(c.players[i].played){
            hasPlayed = true;
          }
        }
      }
      if(hasPlayed){
        Session.set('playing', false);
      }else{
        Session.set('playing', true);
      }
      Session.set('dice',getGameFromHash(c.hash));
      Session.set('isChallenge', true);
      this.render('boggle');
    } else {
      this.render('boggleLoading');
    }
},{name:"boggle.challenge"});

Router.route('/playAgain', function(){
  this.redirect('/boggle');
});

Router.route('/boggle', function () {
  newGameSession();
  this.render('boggle');
});

Router.route('/boggleError', function () {
  this.render('boggleError');
});
Router.route('/user', function () {
  this.render('user');
});
