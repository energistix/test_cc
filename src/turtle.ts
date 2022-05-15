import { PrismaClient } from "@prisma/client"
import EventEmitter from "events"
import { readFileSync, writeFileSync } from "fs"
import { WebSocket } from "ws"

const db = new PrismaClient()
let names = readFileSync("./names.txt", "utf8").split("\n")

export type Message = {
  err: boolean
  data: string
}

export default class Turtle extends EventEmitter {
  static turtles: Turtle[] = []
  label: string
  constructor(private ws: WebSocket) {
    super()
    Turtle.turtles.push(this)
    ws.on("message", (message) => {
      this.emit("message", message)
    })
    this.eval("return os.computerLabel()").then((label) => {
      if (!label) {
        const name = names[Math.floor(Math.random() * names.length)]
        names = names.filter((n) => n !== name)
        writeFileSync("./names.txt", names.join("\n"))
        this.eval('return os.setComputerLabel("' + name + '")')
      } else this.label = label
      db.turtle.findUnique({ where: { label: this.label } }).then((turtle) => {
        if (!turtle) db.turtle.create({ data: { label: this.label } })
      })
    })
  }

  eval(code: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.ws.send(code)
      this.once("message", (message: Message) => {
        message = JSON.parse(message.toString())
        message.err ? reject(message.data) : resolve(message.data)
      })
    })
  }
}
