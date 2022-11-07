const { body } = require("express-validator")

const CreateUserValidation = [
  body("name").not().isEmpty(),
  body("email").isEmail(),
  body("password").not().isEmpty(),
]

const updateUserValidation = [
  body("name").not().isEmpty(),
  body("title").not().isEmpty(),
  body("password").not().isEmpty(),
]

const loginVerification = [
  body("email").isEmail(),
  body("password").not().isEmpty(),
]

const createPostValidation = [body("name").not().isEmpty()]

module.exports = {
  CreateUserValidation,
  loginVerification,
  updateUserValidation,
  createPostValidation,
}
