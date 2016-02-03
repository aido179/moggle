Games = new Mongo.Collection("games");

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
