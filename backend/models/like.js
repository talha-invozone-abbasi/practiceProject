const mongoose = require("mongoose")

const likseSchema = mongoose.Schema(
  {
    postId: {
      required: true,
      ref: "Post",
      type: mongoose?.Schema?.Types?.ObjectId,
    },
    user: {
      type: mongoose?.Schema?.Types?.ObjectId,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = {
  Like: mongoose.model("Like", likseSchema),
}
