import { PrismaClient } from "@prisma/client"
import EventEmitter from "events"
import { readFileSync, writeFileSync } from "fs"
import { WebSocket } from "ws"

const db = new PrismaClient()
db.turtle.deleteMany()
export type Message = {
  error: boolean
  data: string
}

export type turtleData = {
  id: number
}

export default class Turtle extends EventEmitter {
  static turtles: Map<number, Turtle> = new Map()
  data: turtleData
  constructor(private ws: WebSocket) {
    super()

    ws.on("message", (message) => {
      this.emit("message", message)
    })

    this.eval("return os.getComputerID()").then(async (id) => {
      let data = await db.turtle.findFirst({ where: { id: Number(id) } })
      if (!data) data = await db.turtle.create({ data: { id: Number(id) } })
      this.data = data
      Turtle.turtles.set(Number(id), this)

      ws.on("close", () => {
        Turtle.turtles.delete(this.data.id)
      })
    })
  }

  eval(code: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.ws.send(code)
      this.once("message", (message: Message) => {
        message = JSON.parse(message.toString())
        message.error ? reject(message.data) : resolve(message.data)
      })
    })
  }
}
