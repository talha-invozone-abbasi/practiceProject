const router = require("express").Router()
const {
  createUser,
  getUser,
  singleUser,
  deleteUser,
  updateUser,
  uploadImage,
  removeImage,
} = require("../controllers/user.controller")
const authToken = require("../middlewares/authToken")
const upload = require("../middlewares/multer")
const { loginVerification } = require("../middlewares/validations")

router.post("/", [...loginVerification], createUser)
router.get("/", getUser)
router.get("/:id", singleUser)
router.delete("/:id", deleteUser)
router.put("/:id", updateUser)
router.post(
  "/upload-image",
  [upload?.single("profileImage"), authToken],
  uploadImage
)
router.post("/remove-image", [authToken], removeImage)

module.exports = router
