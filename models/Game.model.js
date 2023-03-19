const { Schema, model } = require("mongoose")

const gameSchema = (
    {
        name: {
            type: String,
        },
        description: {
            type: String,
        },
        instructions: {
            type: String,
        },
        jsFile: {
          type: String,
        },
        cssFile: {
            type: String,
          },
         
                logo: {
                    type: String,
                },
        
                img7: {
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
        like: [{ type: Schema.Types.ObjectId, ref: "Like" }],

    }
)

const Game = model("Game", gameSchema)

module.exports = Game
