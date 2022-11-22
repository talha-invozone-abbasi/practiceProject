const router = require("express").Router()
const {
  create,
  get,
  addMember,
  removeMember,
  removeMemberByAdmin,
} = require("../controllers/group.controller")
const authToken = require("../middlewares/authToken")

router.post("/", [authToken], create)
router.post("/add-member/:groupId", [authToken], addMember)
router.post("/remove-member/:groupId", [authToken], removeMember)
router.get("/", [authToken], get)
router.post("/remove-member/:groupId/:userId", [authToken], removeMemberByAdmin)

module.exports = router
