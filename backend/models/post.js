const mongoose = require("mongoose")

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
    comment: [
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
        },
      },
    ],
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
