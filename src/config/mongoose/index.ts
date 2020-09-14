import * as mongoose from 'mongoose'
import { Logger } from '../../config/commons'

export class Mongoose {
  private uri: string
  private mongooseConnection: mongoose.Mongoose

  constructor() {
    Logger.info(process.env.MONGODB as string)
    this.uri = process.env.MONGODB as string
  }

  private async connection() {
    return mongoose
      .connect(this.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      .then(connection => {
        this.mongooseConnection = connection
        return connection
      })
      .catch(error => {
        Logger.error(error)
      })
  }

  async connect(): Promise<mongoose.Mongoose> {
    if (this.mongooseConnection) {
      return this.mongooseConnection
    }

    await this.connection()

    return this.mongooseConnection
  }
}
