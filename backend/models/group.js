const mongoose = require("mongoose")

const groupSchema = mongoose.Schema(
  {
    user: {
      type: mongoose?.Schema?.Types?.ObjectId,
      required: true,
    },
    groupName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: "public",
    },
    members: {
      type: [
        {
          user: mongoose?.Schema?.Types?.ObjectId,
        },
      ],
      required: true,
    },
  },
  {
    timestamp: true,
  }
)

module.exports = mongoose.model("Group", groupSchema)
