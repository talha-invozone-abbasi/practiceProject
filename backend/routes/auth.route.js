const router = require("express").Router()

const { loginIn } = require("../controllers/auth.controller")
const { loginVerification } = require("../middlewares/validations")
router.post("/", [...loginVerification], loginIn)

module.exports = router
