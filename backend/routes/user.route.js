const router = require("express").Router()
const {
  createUser,
  getUser,
  singleUser,
  deleteUser,
  updateUser,
} = require("../controllers/user.controller")
const { CreateUserValidation } = require("../middlewares/validations")
router.post("/", [...CreateUserValidation], createUser)
router.get("/", getUser)
router.get("/:id", singleUser)
router.delete("/:id", deleteUser)
router.put("/:id", updateUser)

module.exports = router
