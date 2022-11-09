const router = require("express").Router()
const {
  create,
  get,
  deletee,
  update,
  likeAddandRemove,
  createComment,
  getComments,
} = require("../controllers/post.controller")
const authToken = require("../middlewares/authToken")
const { createPostValidation } = require("../middlewares/validations")

router.post("/", [authToken, createPostValidation], create)
router.get("/", [authToken], get)
router.delete("/:id", [authToken], deletee)
router.put("/:id", [authToken, createPostValidation], update)
router.post("/like/:id", [authToken], likeAddandRemove)
router.post("/comment/:id", [authToken, createPostValidation], createComment)
router.get("/:postId", [authToken], getComments)

module.exports = router
