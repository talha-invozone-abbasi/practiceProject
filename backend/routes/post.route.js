const { createPost } = require("../controllers/post.controller")
const authToken = require("../middlewares/authToken")

const router = require("express").Router()

router.post("/", [authToken], createPost)

module.exports = router
