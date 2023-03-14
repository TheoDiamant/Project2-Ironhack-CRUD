const { Schema, model } = require("mongoose")

const scoreSchema = (
    {
         score: Number,
        game: { type: Schema.Types.ObjectId, ref: "Game" },
        user: { type: Schema.Types.ObjectId, ref: "User" }
    }
)

const Score = model("Score", scoreSchema)

module.exports = Score

