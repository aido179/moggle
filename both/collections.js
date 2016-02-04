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
    score: {
        type:String,
        label:"Player score",
        optional:true
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
        type: Object
    },
    "players.$.username": {
        type: String,
        label: "Player username"
    },
    "players.$.played": {
        type: Boolean,
        label: "Has the player played this Challenge?"
    },
    "players.$.score": {
        type: Number,
        label: "Players score",
        optional:true
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
