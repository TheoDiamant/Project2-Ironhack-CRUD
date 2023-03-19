const { Schema, model } = require("mongoose");

const likeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    game: { type: Schema.Types.ObjectId, ref: "Game" },
  },
  {
    timestamps: true
  }
);

const Like = model("Like", likeSchema);

module.exports = Like;
