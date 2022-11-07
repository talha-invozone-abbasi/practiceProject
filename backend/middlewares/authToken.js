const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  const token = req.header["x-auth-token"]
  try {
    if (!token) {
      res.status(404).json({ message: "token Not found" })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded?.user?.id
    next()
  } catch (e) {
    console.log("error", e)
  }
}
