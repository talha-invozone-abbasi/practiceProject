const mongoose = require("mongoose")
const { Comment } = require("./comment")
const { Like } = require("./like")

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
        commentId: {
          type: mongoose?.Schema?.Types?.ObjectId,
          ref: "Comment",
        },
      },
    ],
    likes: [
      {
        likeId: {
          type: mongoose?.Schema?.Types?.ObjectId,
          ref: "Like",
        },
      },
    ],

    postType: {
      required: true,
      type: String,
      default: "public",
    },
    group: {
      type: String,
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

postscheme.post("findOneAndRemove", async function (next) {
  try {
    await Comment.deleteMany({
      postId: this?._conditions?._id,
    })
    await Like.deleteMany({
      postId: this?._conditions?._id,
    })
  } catch (e) {
    throw new Error("Error")
  }
})

module.exports = {
  Post: mongoose.model("Post", postscheme),
}
