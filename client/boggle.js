
Session.setDefault('words', []);
Session.setDefault('time', "3:00");
Session.setDefault('dice',[]);
var startTime = moment();
var word = [];
var letterEls = [];
var draggingLetter = false;
updateTime();

Template.boggle.onRendered(function(){
  var game = getGame();
  Session.set('dice',game);

});

Template.boggle.helpers({
  dice: function () {
    return Session.get('dice');
  },
  words: function(){
    return Session.get('words');
  },
  timer: function(){
    return Session.get('time');
  }
});


Template.boggle.events({
  'mousedown .diceletter': function(event){
    draggingLetter = true;
    addLetter(event.currentTarget);
  },
  'mouseenter .diceletter': function(event){
    if(draggingLetter){
      addLetter(event.currentTarget);
    }
  },
  'mouseup': function(event){
    finishWord();
  },
  'mouseleave .board': function(event){
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
    var words = Session.get('words');
    words.push(word.join(""));
    Session.set('words',words);
  }
  draggingLetter = false;
  word = [];
  letterEls = [];
  $(".dice").removeClass("dark-dice");
}
function updateTime(){
  //check for timout
  if( moment(startTime).add(3,'minutes').diff(moment(), 'seconds') <= 0){
    console.log(getScore());
    Session.set('time',"0:00");
  }else{
    var seconds = moment(startTime).add(3,'minutes').diff(moment(), 'seconds');
    var mins = Math.abs(Math.floor(seconds / 60));
    var secs = pad(seconds % 60,2);
    Session.set('time',mins+":"+secs);
    Meteor.setTimeout(updateTime, 1000);
  }
}
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
function getScore(){
  var score = 0;
  var words = Session.get('words');
  for(i=0;i<words.length;i++){
    if(words[i].length == 3){
      score+=1;
    }else{
      score+=words[i].length-3
    }
  }
  return score;
}
