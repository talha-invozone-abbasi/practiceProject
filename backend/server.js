const http = require("http")
const express = require("express")
const bodyParser = require("body-parser")
require("dotenv").config()
// const conectdb = require("./database/database");
const port = process.env.PORT || 4000
const { notFound, errorHandler } = require("./middlewares/errorHandling")
// const routerUser = require("./routes/user.route");

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// conectdb()

const server = http.createServer(app)
app.get("/", (req, res) => {
  res.send("Wellcome to mongoose")
})

// routes user

// app.use("/user", routerUser)

// error handlers
// not found
app.use(notFound)

// error handlers
// errors other found
app.use(errorHandler)

server.listen(port, (err) => {
  if (err) throw err
  console.log("Runing on port")
})
