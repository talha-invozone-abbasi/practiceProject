const PostModel = require("../models/post")
const UserModel = require("../models/user")

const createPost = async (req, res) => {
  const user = req?.user
  const findUser = await UserModel?.findById(req?.user).populate("-password")

  const request = await PostModel.create({
    name: req?.body.name,
    authorName: findUser.name,
    user,
  })
  try {
    await request.save()
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

module.exports = {
  createPost,
}
