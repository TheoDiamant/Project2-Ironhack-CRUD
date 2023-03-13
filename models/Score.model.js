const { Schema, model } = require("mongoose")

const scoreSchema = (
    {
        score: Number,
        gameName: String
    }
)

const Score = model("Score", scoreSchema)

module.exports = Score

