getGame = function(){
  //letter distibutions in boggle.
  //each sub array is a dice.
  //each letter is on one face of the dice.
  var dice = [
    [
      "A","E","A","N","E","G"
    ],
    [
      "A","H","S","P","C","O"
    ],
    [
      "A","S","P","F","F","K"
    ],
    [
      "O","B","J","O","A","B"
    ],
    [
      "I","O","T","M","U","C"
    ],
    [
      "R","Y","V","D","E","L"
    ],
    [
      "L","R","E","I","X","D"
    ],
    [
      "E","I","U","N","E","S"
    ],
    [
      "W","N","G","E","E","H"
    ],
    [
      "L","N","H","N","R","Z"
    ],
    [
      "T","S","T","I","Y","D"
    ],
    [
      "O","W","T","O","A","T"
    ],
    [
      "E","R","T","T","Y","L"
    ],
    [
      "T","O","E","S","S","I"
    ],
    [
      "T","R","E","W","H","V"
    ],
    [
      "N","I","U","H","M","Qu"
    ]
  ];
  //shuffles an array
  function shuffle(o){
      for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
  }
  //duplicate the game array...probably not necessary.
  var game = dice.slice();
  //shuffle the dice position.
  shuffle(game);
  var gameOut = [];
  for(i=1;i<=game.length;i++){
    //shuffle each dice orientation
    shuffle(game[i-1]);
    //calculate Adjacent dice
    var adj = getAdjacencyArray(i);
    //add to the final game
    gameOut.push({
      "letter":game[i-1][0],  //the letter to display
      "order":i,            //used to calculate adjacent letters
      "adj": adj            //used to calculate adjacent letters
    });
  }
  return gameOut;
}
getGameFromHash = function(gameHash){
  //parse string to array - replacing Qu's with just Qs
  var game = gameHash.replace("Qu","Q").split("");
  var gameOut = [];
  for(i=1;i<=game.length;i++){
    //now put back in Qu's
    if(game[i]==="Q"){
      game[i]="Qu";
    }
    //calculate Adjacent dice
    var adj = getAdjacencyArray(i);
    //add to the final game
    gameOut.push({
      "letter":game[i-1],  //the letter to display
      "order":i,            //used to calculate adjacent letters
      "adj": adj            //used to calculate adjacent letters
    });
  }
  return gameOut;
}
getWordScore = function(word){
  if(word.length == 3){
    score=1;
  }else{
    score=word.length-3
  }
  return score
}
getGameHash = function(game){
  //used to identify unique games.
  var hash = "";
  for(i=0;i<game.length;i++){
    hash+=game[i].letter;
  }
  return hash;
}
getAdjacencyArray = function(i){
  var adj = {
    "N": i-4,
    "S": i+4,
  };
  if(i%4!=0){ //Not on right edge
    adj["E"] = i+1;
    adj["NE"] = i+1-4;
    adj["SE"] = i+1+4;
  }
  if((i-1)%4!=0){ //not on left edge
    adj["W"] = i-1;
    adj["NW"] = i-1-4;
    adj["SW"] = i-1+4;
  }
  return adj;
}
newGameSession = function(){
  Session.set('playing', true);
  Session.set('isChallenge', false);
  Session.set('words',[]);
  Session.set('score', 0);
  Session.set('dice', getGame());
}
