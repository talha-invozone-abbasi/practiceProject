const mongoose = require("mongoose")

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Object,
      required: true,
    },
    profileImage: {
      type: String,
    },
    followers: {
      type: Number,
      default: 0,
    },
    accountType: {
      type: String,
      required: true,
      default: "public",
    },
  },
  {
    timestamp: true,
  }
)

userSchema.pre("save", function (next) {
  const doc = this
  doc.role.key = doc?._id
  next()
})
userSchema.pre(["updateOne", "findOneAndUpdate"], function (next) {
  const doc = this
  doc._update.role.key = doc?._conditions?.id
  next()
})

module.exports = mongoose.model("User", userSchema)
