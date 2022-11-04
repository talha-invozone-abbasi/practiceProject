const mongoose = require("mongoose")

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Mongoose Connect")
  } catch (e) {
    console.log("Error", e)
  }
}

module.exports = connectDb
