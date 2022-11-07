const mongoose = require("mongoose")

const connectDb = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI)
  } catch (e) {}
}

module.exports = connectDb
