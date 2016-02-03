Meteor.startup(function () {
  if (Dictionary.find().count() === 0) {
    console.log("Populating dictionary...");
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    alphabet.split("");
    for(i=0;i<alphabet.length;i++){
      var words = Assets.getText(alphabet[i]+" Words.csv");
      var wordArr = words.split("\n");
      console.log(alphabet[i]);
      for(j=0;j<wordArr.length;j++){
        Dictionary.insert({word: wordArr[j]});
      }
    }
  }
  console.log("Checking Dict:");
  console.log(Dictionary.find({word:"explicit"}).count());
});
