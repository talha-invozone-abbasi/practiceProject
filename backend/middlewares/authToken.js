const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  const token = req.headers["x-auth-token"]
  try {
    if (!token) {
      return res.status(404).json({ message: "token Not found" })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded?.user?.id

    next()
  } catch (e) {
    throw new Error("Something went wrong when verifying token")
  }
}
