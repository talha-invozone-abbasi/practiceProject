const { validationResult } = require("express-validator")
const { Post: PostModel } = require("../models/post")
// const { Comment: Comment } = require("../models/comment")

const UserModel = require("../models/user")
const GroupModel = require("../models/group")
const { Comment } = require("../models/comment")
const { Like: LikeModel } = require("../models/like")

const create = async (req, res) => {
  const groupId = req?.params?.groupId
  let group = ""
  if (groupId) {
    try {
      const findGroup = await GroupModel.findById(groupId)
      if (!findGroup) {
        res.status(404)
        throw new Error("Group not found")
      }
      group = findGroup?.id
    } catch (err) {
      res.json({ message: err.message })
    }
  }
  const errors = validationResult(req).formatWith((message) => message)
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() })
  }
  try {
    const user = req?.user

    const findUser = await UserModel?.findById(req?.user).select("-password")

    if (!findUser) {
      res.status(404)
      throw new Error("User not Authenticated")
    }
    const request = await PostModel.create({
      name: req?.body.name,
      authorName: findUser.name,
      user,
      group,
    })

    await request.save()
    return res.status(200).json({
      success: true,
      message: "post created successfully",
      data: request,
    })
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" })
  }
}
const get = async (req, res) => {
  let where = {}
  if (req?.body?.user) {
    where = { user: req?.body.user }
  } else if (req?.body?.postType) {
    where = { postType: req?.body.postType }
  } else if (req?.body?.group) {
    where = { group: req?.body?.group }
  }
  const request = await PostModel.find(where).populate("comment.commentId", [
    "name",
  ])
  try {
    if (!request) {
      res.status(404)
      throw new Error("Not found Post")
    }
    res?.status(200).json(request)
  } catch (err) {
    throw new Error({ message: err.message })
  }
}

const deletee = async (req, res) => {
  const id = req?.params?.id
  const userRequest = await UserModel.findById(req?.user)

  try {
    if (!userRequest) {
      res.status(403)
      throw new Error("User is not authorized")
    }
    const postRequest = await PostModel.findByIdAndRemove(id)
    try {
      if (!postRequest) {
        res.status(404)
        throw new Error("Post is not Present")
      }
      return res.status(200).json({ message: "Post deleted" })
    } catch (err) {
      return res?.json({ message: err.message })
    }
  } catch (err) {
    return res?.json({ message: err.message })
  }
}
const update = async (req, res) => {
  const errors = validationResult(req).formatWith((message) => message)
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() })
  }

  const id = req?.params?.id
  const userRequest = await UserModel.findById(req?.user)

  try {
    if (!userRequest) {
      res.status(403)
      throw new Error("User is not authorized")
    }
    let postRequest = await PostModel.findById(id)
    try {
      if (!postRequest) {
        res.status(404)
        throw new Error("Post is not Present")
      }
      postRequest = await PostModel.findOneAndUpdate(
        id,
        { name: req?.body?.name },
        { new: true }
      )
      return res.status(200).json({
        success: true,
        message: "post Updated successfully",
        data: postRequest,
      })
    } catch (err) {
      return res?.json({ message: err.message })
    }
  } catch (err) {
    return res?.json({ message: err.message })
  }
}

const likeAddandRemove = async (req, res) => {
  const id = req.params.id

  try {
    const getPostRequest = await PostModel?.findById(id)
    const getUserRequest = await UserModel?.findById(req?.user)

    try {
      if (!getPostRequest) {
        res.status(404)
        throw new Error("Post is not Present")
      }
      if (!getUserRequest) {
        res.status(403)
        throw new Error("User is not authorized")
      }
      const validateIfUserAlreadyLiked = await LikeModel?.findOne({
        user: req?.user,
        postId: getPostRequest?.id,
      })

      if (validateIfUserAlreadyLiked) {
        const removeLike = await LikeModel.findOneAndRemove({
          user: req?.user,
          postId: getPostRequest?.id,
        })

        if (!removeLike) {
          res.status(404)
          throw new Error("Post is not Present")
        }

        const getIndex = getPostRequest?.likes?.map((user) =>
          user.likeId?.toString().indexOf(removeLike?.id)
        )

        getPostRequest?.likes?.splice(getIndex, 1)
        await getPostRequest.save()

        return res.status(200).json({
          message: true,
        })
      }
    } catch (err) {
      return res?.json({ message: err.message })
    }

    const likeAdded = await LikeModel.create({
      user: req?.user,
      postId: getPostRequest?.id,
    })
    await likeAdded.save()

    getPostRequest?.likes.push({ likeId: likeAdded?.id })
    await getPostRequest.save()
    return res.status(200).json({
      success: true,
      message: "Like Sucessfully",
      getPostRequest,
    })
  } catch (err) {
    return res?.json({ message: err.message })
  }
}

const createComment = async (req, res) => {
  const errors = validationResult(req).formatWith((message) => message)
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() })
  }
  try {
    const id = req.params.id
    const user = req?.user

    const findUser = await UserModel?.findById(req?.user).select("-password")
    const findPost = await PostModel?.findById(id)

    if (!findUser) {
      res.status(404)
      throw new Error("User not Authenticated")
    }
    if (!findPost) {
      res.status(404)
      throw new Error("Post not present")
    }

    const comment = {
      name: req?.body.name,
      authorName: findUser.name,
      user,
      postId: findPost?.id,
    }
    const createComment2 = await Comment.create(comment)
    await createComment2.save()

    findPost?.comment?.unshift({ commentId: createComment2?.id })
    await findPost.save()

    return res.status(200).json({
      success: true,
      message: "post created successfully",
      data: createComment2,
    })
  } catch (err) {
    return res.status(500).json({ message: err?.message })
  }
}

const getComments = async (req, res) => {
  const postId = req?.params?.postId

  const request = await PostModel.findById(postId)
  try {
    if (!request) {
      res.status(404)
      throw new Error("Not found Post")
    }
    res?.status(200).json(request?.comment)
  } catch (err) {
    throw new Error({ message: err.message })
  }
}
const deleteComments = async (req, res) => {
  const postId = req?.params?.postId
  const commentId = req?.params?.commentId

  const postRequest = await PostModel.findById(postId)

  try {
    if (!postRequest) {
      res.status(404)
      throw new Error("Post is not Present")
    }
    const findIndex = postRequest.comment?.map((item) =>
      item?.id.indexOf(commentId)
    )
    postRequest.comment?.splice(findIndex, 1)
    await postRequest.save()
    return res.status(200).json({ message: "Post deleted" })
  } catch (err) {
    return res?.json({ message: err.message })
  }
}

module.exports = {
  create,
  get,
  deletee,
  update,
  likeAddandRemove,
  createComment,
  getComments,
  deleteComments,
}
