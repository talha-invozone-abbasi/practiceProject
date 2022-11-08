const { validationResult } = require("express-validator")
const PostModel = require("../models/post")
const UserModel = require("../models/user")

const create = async (req, res) => {
  const errors = validationResult(req).formatWith((message) => message)
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() })
  }
  try {
    const user = req?.user

    const findUser = await UserModel?.findById(req?.user).select("-password")

    if (!findUser) {
      res.status(404)
      throw new Error("User not Authenticated")
    }
    const request = await PostModel.create({
      name: req?.body.name,
      authorName: findUser.name,
      user,
    })

    await request.save()
    return res.status(200).json({
      success: true,
      message: "post created successfully",
      data: request,
    })
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" })
  }
}
const get = async (req, res) => {
  let where = {}
  if (req?.body?.user) {
    where = { user: req?.body.user }
  } else if (req?.body?.postType) {
    where = { postType: req?.body.postType }
  }
  const request = await PostModel.find(where)
  try {
    if (!request) {
      res.status(404)
      throw new Error("Not found Post")
    }
    res?.status(200).json(request)
  } catch (err) {
    throw new Error({ message: err.message })
  }
}

const deletee = async (req, res) => {
  const id = req?.params?.id
  const userRequest = await UserModel.findById(req?.user)

  try {
    if (!userRequest) {
      res.status(403)
      throw new Error("User is not authorized")
    }
    const postRequest = await PostModel.findByIdAndRemove(id)
    try {
      if (!postRequest) {
        res.status(404)
        throw new Error("Post is not Present")
      }
      return res.status(200).json({ message: "Post deleted" })
    } catch (err) {
      return res?.json({ message: err.message })
    }
  } catch (err) {
    return res?.json({ message: err.message })
  }
}
const update = async (req, res) => {
  const errors = validationResult(req).formatWith((message) => message)
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() })
  }
  const id = req?.params?.id
  const userRequest = await UserModel.findById(req?.user)

  try {
    if (!userRequest) {
      res.status(403)
      throw new Error("User is not authorized")
    }
    let postRequest = await PostModel.findById(id)
    try {
      if (!postRequest) {
        res.status(404)
        throw new Error("Post is not Present")
      }
      postRequest = await PostModel.findOneAndUpdate(
        id,
        { name: req?.body?.name },
        { new: true }
      )
      return res.status(200).json({
        success: true,
        message: "post Updated successfully",
        data: postRequest,
      })
    } catch (err) {
      return res?.json({ message: err.message })
    }
  } catch (err) {
    return res?.json({ message: err.message })
  }
}

module.exports = {
  create,
  get,
  deletee,
  update,
}
