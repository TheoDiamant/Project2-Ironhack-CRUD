const { Schema, model } = require("mongoose")

const gameSchema = (
    {
        name: {
            type: String,
        },
        jsFile: {
          type: String,
        },
        cssFile: {
            type: String,
          },
            action1: {
                type: String,
            },
            action2: {
                type: String,
            },
            action3: {
                type: String,
            },
            action4: {
                type: String,
            },
            
            action5: {
                type: String,
            },
            
            action6: {
                type: String,
            },
            
            action7: {
                type: String,
            },
                logo: {
                    type: String,
                },
                img1: {
                    type: String
                },
                img2: {
                    type: String
                },
                img3: {
                    type: String
                },
                img4: {
                    type: String
                },
                img5: {
                    type: String
                },
                img6: {
                    type: String
                },
                img7: {
                    type: String
                },
        song1: {
            type: String
        },
        song2: {
            type: String
        },
        song3: {
            type: String
        },
        song4: {
            type: String
        },
        template: { type: String, required: true },
        score: [{ type: Schema.Types.ObjectId, ref: "Score" }],
    }
)

const Game = model("Game", gameSchema)

module.exports = Game
