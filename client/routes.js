Router.configure({
  layoutTemplate: 'ApplicationLayout'
});


Router.route('/', function () {
  this.render('home');
});

Router.route('/boggle/:gamehash', function () {
  //generate the game
  var hash = this.params.gamehash;
  if(hash.length!=16){
    Session.set('dice',getGame());
  }else{
    Session.set('dice',getGameFromHash(hash));
  }
  //make sure the user has not already played this game
  Meteor.call("checkGame",getGameHash(Session.get('dice')),function(error, result){
    if(result){
      Router.go('/boggleError');
    }
  });

  this.render('boggle');
});

Router.route('/boggle', function () {
  Session.set('dice',getGame());
  this.render('boggle');
});

Router.route('/boggleComplete', function () {
  this.render('boggleComplete');
});
Router.route('/boggleError', function () {
  this.render('boggleError');
});
Router.route('/user', function () {
  this.render('user');
});
