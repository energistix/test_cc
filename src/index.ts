console.clear()

import { readFileSync, writeFileSync } from "fs"
import { Server } from "ws"
import Turtle from "./turtle"
const wss = new Server({ port: 8081 })

wss.on("listening", () => {
  console.log("listening")
})

wss.on("connection", async (ws) => {
  new Turtle(ws)
})
