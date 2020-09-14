import { Container } from 'typedi'
import { createServer } from 'http'
import express from './config/express'
import { Logger } from './config/commons'
import { Mongoose } from './config/mongoose'
import CONFIG from './config/env'

class AppServer {
  static init() {
    const port = express.get('port')

    const server = createServer(express)

    const mongoose: Mongoose = Container.get(Mongoose)
    mongoose.connect()
    Logger.info('Mongoose connected!')

    server.listen(port, () => {
      Logger.info({
        level: 'info',
        message: `API server started in port: ${CONFIG.port}, ready for connections!`,
      })
    })
  }
}

AppServer.init()
