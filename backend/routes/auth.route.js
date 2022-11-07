const router = require("express").Router()

const { loginIn } = require("../controllers/auth.controller")
const { CreateUserValidation } = require("../middlewares/validations")
router.post("/", [...CreateUserValidation], loginIn)

module.exports = router
