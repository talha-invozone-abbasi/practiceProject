const { validationResult } = require("express-validator")
const UserModel = require("../models/user")
const jwt = require("jsonwebtoken")
const bycrypt = require("bcryptjs")

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req).formatWith((msg) => msg)
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array() })
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
      expiresIn: 3600 * 30,
    })

    await findEmail.save()
    return res.status(201).json({ findEmail, tokenID })
  } catch (err) {
    return res.json({ msg: err.message })
  }
}
const getUser = async (req, res) => {
  let where = {}
  if (req?.body?.title) {
    where = { "role.title": req.body.title }
  }
  try {
    const getUser = await UserModel.find(where)
    if (getUser) {
      res.status(200).json(getUser)
    }
  } catch (err) {
    console.log(err)
  }
}

const singleUser = async (req, res) => {
  try {
    const { id } = req.params
    const singleUser = await UserModel.findById(id)
    if (!singleUser) {
      res.status(404)
      throw new Error("User not found")
    }
    return res.status(200).json(singleUser)
  } catch (err) {
    res.json({ msg: err.message })
  }
}
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    const singleUser = await UserModel.findByIdAndRemove(id)
    if (!singleUser) {
      res.status(404)
      throw new Error("User not found")
    }
    return res.status(200).json({ msg: "user deleted" })
  } catch (err) {
    res.json({ msg: err.message })
  }
}

const updateUser = async (req, res) => {
  try {
    if (req?.body?.email) {
      return res.status(400).json({
        msg: "Email cannot be edited",
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
    return res.json({ msg: err.message })
  }
}

module.exports = {
  createUser,
  getUser,
  singleUser,
  deleteUser,
  updateUser,
}
