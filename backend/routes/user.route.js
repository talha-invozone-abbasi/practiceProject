const router = require("express").Router()
const {
  createUser,
  getUser,
  singleUser,
  deleteUser,
  updateUser,
} = require("../controllers/user.controller")
const { loginVerification } = require("../middlewares/validations")
router.post("/", [...loginVerification], createUser)
router.get("/", getUser)
router.get("/:id", singleUser)
router.delete("/:id", deleteUser)
router.put("/:id", updateUser)

module.exports = router
