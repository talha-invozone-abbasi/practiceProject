const mongoose = require("mongoose")

const commentsSchema = new mongoose.Schema(
  {
    postId: {
      required: true,
      ref: "Post",
      type: mongoose?.Schema?.Types?.ObjectId,
    },
    user: {
      required: true,
      ref: "User",
      type: mongoose?.Schema?.Types?.ObjectId,
    },
    name: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = {
  Comment: mongoose.model("Comment", commentsSchema),
}
