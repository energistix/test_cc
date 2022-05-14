console.clear()

import express from "express"
import { createServer } from "http"
const app = express()
const server = createServer(app)
import { Socket } from "socket.io"
const io = require("socket.io")(server)

server.listen(8080, () => {
  console.log("Server started")
})

io.on("connection", (socket: Socket) => {
  console.log("Client connected")
  socket.on("disconnect", () => {
    console.log("Client disconnected")
  })
})
