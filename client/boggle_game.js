
Session.setDefault('words', []);
Session.setDefault('discarded',[]);
Session.setDefault('unchecked',[]);
Session.setDefault('time', "3:00");
Session.setDefault('score', 0);

var startTime = moment();
var word = [];
var letterEls = [];
var draggingLetter = false;
var timer;


Template.boggleGame.onRendered(function(){
  //Challenge dice are set on the router.

  Session.set('words', []);
  Session.set('discarded', []);
  Session.set('unchecked', []);
  Session.set('score', 0);
  startTime = moment();
  updateTime();
  //Store game
  Meteor.call("addGame", getGameHash(Session.get('dice')));
  if(Session.get('isChallenge')){
    params = Iron.controller().getParams();
    Session.set('chal_id', params.chal_id);
  }
});

Template.boggleGame.helpers({
  dice: function () {
    return Session.get('dice');
  },
  game: function(){
    return Games.findOne({hash: getGameHash(Session.get('dice')), player:Meteor.userId()})
  },
  gameWords: function(){
    var g = Games.findOne({hash: getGameHash(Session.get('dice')), player:Meteor.userId()});
    if(g === undefined){
      return [];
    }else{
      var gameWordsArray = Games.findOne({hash: getGameHash(Session.get('dice')), player:Meteor.userId()}).words;
      return gameWordsArray.reverse();
    }
  },
  gameWordsUnchecked: function(){
    return Session.get('unchecked');
  },
  discarded: function(){
    return Session.get('discarded');
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
    var unCheckedWords = Session.get('unchecked');
    if(words.indexOf(word.join(""))==-1 && unCheckedWords.indexOf(word.join(""))==-1){
      //add word to unchecked
      var uncheck = Session.get('unchecked');
      uncheck.push(word.join(""));
      Session.set('unchecked', uncheck);
      //save and score word
      Meteor.call("checkWord", word.join(""), getGameHash(Session.get('dice')), function(err, word_score){
        //remove from unchecked
        var uncheck = Session.get('unchecked');
        var ind = uncheck.indexOf(word_score.word);
        uncheck.splice(ind, 1);
        Session.set('unchecked',uncheck);

        if(word_score.score>0){
          //update session score
          var score = Session.get('score');
          score+=word_score.score;
          Session.set('score', score);
          //update session words
          words.push(word_score.word);
          Session.set('words',words);
        }else{
          //score == 0
          //add to discarded
          var discarded = Session.get('discarded');
          discarded.push(word_score.word);
          Session.set('discarded', discarded);
        }

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

endGame = function(){
  //clear word
  word = [];
  //update game state
  Session.set('playing', false);
  //stop timer
  var t = Session.get('timer');
  Meteor.clearTimeout(t);
  //
  console.log("storing game...");
  var score = Session.get('score');
  console.log("score:"+score);
  //store challenge
  if(Session.get('isChallenge')){
    Meteor.call("completeChallenge", params.chal_id, score);
  }
  //store user score
  var hash = getGameHash(Session.get('dice'));
  Meteor.call("updateScore", hash, score);

}
