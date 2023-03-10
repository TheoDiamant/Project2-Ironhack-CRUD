const { Schema, model } = require("mongoose")

const scoreSchema = (
    {
        score: Number
    }
)

const Score = model("Score", scoreSchema)

module.exports = Score

