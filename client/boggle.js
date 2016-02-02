
Session.setDefault('words', []);
Session.setDefault('time', "3:00");
var startTime = moment();
var word = [];
var letterEls = [];
var draggingLetter = false;
updateTime();

Template.boggle.helpers({
  dice: function () {
    return [
      {letter:"d"},{letter:"e"},{letter:"a"},{letter:"d"},
      {letter:"d"},{letter:"o"},{letter:"v"},{letter:"e"},
      {letter:"d"},{letter:"o"},{letter:"n"},{letter:"t"},
      {letter:"e"},{letter:"a"},{letter:"t"},{letter:"Qu"}];
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
    var letter = $(el).data('letter');
    word.push(letter);
    letterEls.push(el);
    $(el).parent().addClass("dark-dice");
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
