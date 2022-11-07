const {
  create,
  get,
  deletee,
  update,
} = require("../controllers/post.controller")
const authToken = require("../middlewares/authToken")
const { createPostValidation } = require("../middlewares/validations")

const router = require("express").Router()

router.post("/", [authToken, createPostValidation], create)
router.get("/", [authToken], get)
router.delete("/:id", [authToken], deletee)
router.put("/:id", [authToken, createPostValidation], update)

module.exports = router
