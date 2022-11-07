const mongoose = require("mongoose")

const postComment = mongoose.Schema(
  {
    user: {
      required: true,
      ref: "User",
      type: mongoose?.Schema?.Types?.ObjectId,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamp: true,
  }
)

const postscheme = mongoose.Schema(
  {
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
      required: true,
    },
    comment: [postComment],
    likes: [
      {
        user: {
          type: mongoose?.Schema?.Types?.ObjectId,
        },
      },
    ],

    postType: {
      required: true,
      type: String,
      default: "public",
    },
    share: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamp: true,
  }
)

module.exports = mongoose.model("Post", postscheme)
