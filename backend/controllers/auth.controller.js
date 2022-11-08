const bycrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")
const UserModel = require("../models/user")

const loginIn = async (req, res) => {
  const errors = validationResult(req).formatWith((message) => message)
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() })
  }

  let request = await UserModel.findOne({ email: req?.body?.email })

  try {
    if (!request) {
      res.status(404)
      throw new Error("Email not Valid")
    }
    const verifyPassword = await bycrypt?.compare(
      req?.body?.password,
      request?.password
    )
    if (!verifyPassword) {
      res.status(404)
      throw new Error("password not Valid")
    }

    const token = {
      user: {
        id: request.id,
      },
    }
    const generateToken = jwt.sign(token, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    })
    request = await UserModel.findOne({ email: req?.body?.email }).select(
      "-password"
    )
    return res?.status(200).json({
      message: "User Login Sucessfully",
      success: true,
      user: request,
      token: generateToken,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  loginIn,
}
