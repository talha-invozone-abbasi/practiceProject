const UserModel = require("../models/user")
const GroupModel = require("../models/group")

const create = async (req, res) => {
  //   const errors = validationResult(req).formatWith((message) => message)
  //   if (!errors.isEmpty()) {
  //     return res.status(400).json({ message: errors.array() })
  //   }
  try {
    const user = req?.user
    const findUser = await UserModel?.findById(req?.user).select("-password")
    if (!findUser) {
      res.status(404)
      throw new Error("User not Authenticated")
    }

    const request = await GroupModel.create({
      groupName: req?.body.groupName,
      user,
    })
    await request.save()
    return res.status(200).json({
      success: true,
      message: "Group created successfully",
      data: request,
    })
  } catch (err) {
    return res.status(500).json({ message: err?.message })
  }
}
const get = async (req, res) => {
  let where = {}
  if (req?.body?.user) {
    where = { user: req?.body.user }
  } else if (req?.body?.type) {
    where = { type: req?.body.type }
  }
  const request = await GroupModel.find(where)
  try {
    if (!request) {
      res.status(404)
      throw new Error("Not found group")
    }
    res?.status(200).json(request)
  } catch (err) {
    throw new Error({ message: err.message })
  }
}
const addMember = async (req, res) => {
  try {
    const groupId = req?.params.groupId
    const findUser = await UserModel?.findById(req?.user).select("-password")
    if (!findUser) {
      res.status(404)
      throw new Error("User not Authenticated")
    }
    const findGroup = await GroupModel.findById(groupId)
    if (!findGroup) {
      res.status(404)
      throw new Error("Group not present")
    }
    const isUserAlreadyInGroup = findGroup?.members?.map(
      (e) => e?.user?.toString() === req?.user.toString()
    )

    if (isUserAlreadyInGroup?.length > 0) {
      res.status(404)
      throw new Error("you are already joined this group ")
    }
    findGroup?.members.unshift(req?.user)

    await findGroup.save()
    return res.status(200).json({
      success: true,
      message: "Group created successfully",
      data: findGroup,
    })
  } catch (err) {
    return res.status(500).json({ message: err?.message })
  }
}
const removeMember = async (req, res) => {
  try {
    const groupId = req?.params.groupId
    const findUser = await UserModel?.findById(req?.user).select("-password")
    if (!findUser) {
      res.status(404)
      throw new Error("User not Authenticated")
    }
    const findGroup = await GroupModel.findById(groupId)
    if (!findGroup) {
      res.status(404)
      throw new Error("Group not present")
    }
    const isUserAlreadyInGroup = findGroup?.members?.map(
      (e) => e?.user?.toString() === req?.user.toString()
    )

    if (isUserAlreadyInGroup?.length > 0) {
      const getIndex = findGroup?.members?.map((user) =>
        user.user?.toString().indexOf(req?.user)
      )
      findGroup?.members?.splice(getIndex, 1)
      await findGroup.save()
      return res.status(200).json({
        success: true,
        message: "User Removed",
        data: findGroup,
      })
    }
  } catch (err) {
    return res.status(500).json({ message: err?.message })
  }
}

module.exports = {
  create,
  get,
  addMember,
  removeMember,
}
