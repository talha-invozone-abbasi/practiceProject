const mongoose = require("mongoose")

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
  } catch (e) {
    throw new Error("Couldn't connect to Mongo'")
  }
}

module.exports = connectDb
