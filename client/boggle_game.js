
Session.setDefault('words', []);
Session.setDefault('time', "3:00");
Session.setDefault('score', 0);

var startTime = moment();
var word = [];
var letterEls = [];
var draggingLetter = false;
var timer;

Template.boggleGame.onRendered(function(){
  //Challenge dice are set on the router.

  //make sure use has not already played this challenge game.
//
  //if (Session.get('playing')){

  //}


  Session.set('words', []);
  Session.set('score', 0);
  startTime = moment();
  updateTime();
  //Store game
  Meteor.call("addGame", getGameHash(Session.get('dice')));
});

Template.boggleGame.helpers({
  dice: function () {
    return Session.get('dice');
  },
  game: function(){
    return Games.findOne({hash: getGameHash(Session.get('dice')), player:Meteor.userId()})
  },
  timer: function(){
    return Session.get('time');
  },
  isChallenge: function(){
    return Session.get('isChallenge');
  }
});


Template.boggleGame.events({
  'click .endGame': function(event){
    endGame();
  },
  'mousedown .diceletter, touchstart .diceletter': function(event){
    draggingLetter = true;
    addLetter(event.currentTarget);
    event.preventDefault();
    event.stopPropagation();
  },
  'mouseenter .diceletter': function(event){
    if(draggingLetter){
      addLetter(event.currentTarget);
    }
  },
  'touchmove': function(event){
    if(draggingLetter){
      var el = document.elementFromPoint(event.originalEvent.touches[0].clientX, event.originalEvent.touches[0].clientY);
      if($(el).hasClass("diceletter")){
        addLetter(el);
      }
    }
  },
  'mouseup, touchend': function(event){
    finishWord();
  },
  'mouseleave .board, touchleave .board': function(event){
    finishWord();
  },
});

function addLetter(el){
  //don't allow the same letter twice
  if(letterEls.indexOf(el)==-1){
    //allow the first letter...
    if(letterEls.length == 0){
      var letter = $(el).data('letter');
      word.push(letter);
      letterEls.push(el);
      $(el).parent().addClass("dark-dice");
    }else{
      //only allow adjacent letters, using letter order.
      var prev = $(letterEls[letterEls.length-1]).data('order');
      var curr = $(el).data('order');
      var game = Session.get('dice');
      //get all dice adjacent to the new (current) dice
      var adjToCurr = game[curr-1]["adj"];
      //loop through and check if the prev dice is there.
      for(adjDice in adjToCurr){
        if (adjToCurr.hasOwnProperty(adjDice)){
          if(adjToCurr[adjDice]===prev){
            //found prev dice, so we can add letter
            var letter = $(el).data('letter');
            word.push(letter);
            letterEls.push(el);
            $(el).parent().addClass("dark-dice");
            break;
          }
        }
      }
    }
  }
}

function finishWord(){
  //don't add words that are too small
  if(word.length >= 3){
    //don't add duplicate words
    var words = Session.get('words');
    if(words.indexOf(word.join(""))==-1){
      //save and score word
      Meteor.call("checkWord", word.join(""), getGameHash(Session.get('dice')), function(err, wordscore){
        //update session score
        var score = Session.get('score');
        score+=wordscore;
        Session.set('score', score);
        //update session words
        words.push(word.join(""));
        Session.set('words',words);
      });
    }else{
      //show duplicate warning
    }
  }
  draggingLetter = false;
  word = [];
  letterEls = [];
  $(".dice").removeClass("dark-dice");
}
function updateTime(){
  //check for timout
  if( moment(startTime).add(3,'minutes').diff(moment(), 'seconds') <= 0){
    //Game Over
    endGame();
    Session.set('time',"0:00");
  }else{
    //Continue Game
    var seconds = moment(startTime).add(3,'minutes').diff(moment(), 'seconds');
    var mins = Math.abs(Math.floor(seconds / 60));
    var secs = pad(seconds % 60,2);
    Session.set('time',mins+":"+secs);
    var t = Meteor.setTimeout(updateTime, 1000);
    Session.set('timer',t);
  }
}
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
//End game early for testing purposes
endGame = function(){
  //update game state
  Session.set('playing', false);
  //stop timer
  var t = Session.get('timer');
  Meteor.clearTimeout(t);

}
