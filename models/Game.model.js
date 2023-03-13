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
        logo: {
            type: String,
        },
        img1: {
            type: String
        },
        img2: {
            type: String
        },
        scores: [{ type: Schema.Types.ObjectId, ref: "Score" }]
    }
)

const Game = model("Game", gameSchema)

module.exports = Game
