import EventEmitter from "events"
import { WebSocket } from "ws"

export type Message = {
  err: boolean
  data: string
}

export default class Turtle extends EventEmitter {
  static turtles: Turtle[] = []
  constructor(private ws: WebSocket) {
    super()
    Turtle.turtles.push(this)
    ws.on("message", (message) => {
      this.emit("message", message)
    })
  }

  eval(code: string) {
    return new Promise((resolve, reject) => {
      this.ws.send(code)
      this.once("message", (message: Message) => {
        message = JSON.parse(message.toString())
        message.err ? reject(message.data) : resolve(message.data)
      })
    })
  }
}
