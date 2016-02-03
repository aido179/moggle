Games = new Mongo.Collection("games");
Challenges = new Mongo.Collection("challenges");
Dictionary = new Mongo.Collection("dictionary");


var Schemas = {};

Schemas.Games = new SimpleSchema({
    hash: {
        type: String,
        label: "Hash",
        max: 17
    },
    player: {
        type:String,
        label:"Player"
    },
    words: {
        type: Array,
        optional: true
    },
    "words.$": {
        type: String
    },
    finished: {
      type: Date
    }
});
Games.attachSchema(Schemas.Games);

Schemas.Challenges = new SimpleSchema({
    hash: {
        type: String,
        label: "Hash",
        max: 17
    },
    players: {
        type: Array,
        optional: true
    },
    "players.$": {
        type: String
    },
    completedBy: {
      type: Array,
      optional: true
    },
    "completedBy.$":{
      type: String
    }
});
Challenges.attachSchema(Schemas.Challenges);

Schemas.Dictionary = new SimpleSchema({
    word: {
        type: String,
        label: "Word"
    }
});
Dictionary.attachSchema(Schemas.Dictionary);
