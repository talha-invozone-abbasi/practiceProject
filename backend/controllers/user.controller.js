const { validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")
const bycrypt = require("bcryptjs")
const UserModel = require("../models/user")

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req).formatWith((message) => message)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() })
    }
    let findEmail = await UserModel.findOne({ email: req.body.email })
    if (findEmail) {
      res.status(404)
      throw new Error("Email alreay Exists!")
    }
    const admin = {
      title: req.body.title,
    }
    const genSalt = await bycrypt?.genSalt(10)
    const hashPassowrd = await bycrypt?.hash(req.body.password, genSalt)
    req.body.password = hashPassowrd

    findEmail = await UserModel.create({ ...req.body, role: { ...admin } })

    const token = {
      user: {
        id: findEmail._id,
      },
    }
    const tokenID = jwt.sign(token, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    })

    await findEmail.save()
    return res.status(201).json({ findEmail, tokenID })
  } catch (err) {
    return res.json({ message: err.message })
  }
}
const getUser = async (req, res) => {
  let where = {}
  if (req?.body?.title) {
    where = { "role.title": req.body.title }
  }
  try {
    const getUserRequest = await UserModel.find(where)
    if (getUserRequest) {
      res.status(200).json(getUserRequest)
    }
  } catch (err) {
    res.json({ message: err.message })
  }
}

const singleUser = async (req, res) => {
  try {
    const { id } = req.params
    const singleUserRequest = await UserModel.findById(id)
    if (!singleUserRequest) {
      res.status(404)
      throw new Error("User not found")
    }
    return res.status(200).json(singleUserRequest)
  } catch (err) {
    res.json({ message: err.message })
  }
}
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    const singleUserRequest = await UserModel.findByIdAndRemove(id)
    if (!singleUserRequest) {
      res.status(404)
      throw new Error("User not found")
    }
    return res.status(200).json({ message: "user deleted" })
  } catch (err) {
    res.json({ message: err.message })
  }
}

const updateUser = async (req, res) => {
  try {
    if (req?.body?.email) {
      return res.status(400).json({
        message: "Email cannot be edited",
      })
    }
    if (req?.body?.password) {
      const genSalt = await bycrypt?.genSalt(10)
      const hashPassowrd = await bycrypt?.hash(req.body.password, genSalt)
      req.body.password = hashPassowrd
    }
    const { id } = req.params
    const findId = await UserModel.findById(id)
    const findEmail = await UserModel.findOneAndUpdate(
      { id: findId._id },
      { ...req.body, role: { title: req.body.title } },
      {
        new: true,
      }
    )
    if (!findEmail) {
      res.status(404)
      throw new Error("Email alreay Exists!")
    }
    return res.status(201).json(findEmail)
  } catch (err) {
    return res.json({ message: err.message })
  }
}

module.exports = {
  createUser,
  getUser,
  singleUser,
  deleteUser,
  updateUser,
}
