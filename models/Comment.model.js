const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    content: String
  },
  {
    timestamps: true
  }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;
