const http = require("http")
const express = require("express")
const bodyParser = require("body-parser")
require("dotenv").config()
const conectdb = require("./database/db")
const port = process.env.PORT || 4000
const { notFound, errorHandler } = require("./middlewares/errorHandling")
const routerUser = require("./routes/user.route")
const routerAuth = require("./routes/auth.route")
const routerPost = require("./routes/post.route")

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

conectdb()

const server = http.createServer(app)
app.get("/", (req, res) => {
  res.send("Wellcome to mongoose")
})

app.use("/api/users", routerUser)
app.use("/api/auth", routerAuth)
app.use("/api/post", routerPost)

app.use(notFound)

app.use(errorHandler)

server.listen(port, (err) => {
  if (err) throw err
  console.log("Runing on port")
})
