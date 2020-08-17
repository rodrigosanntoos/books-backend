import * as HttpStatus from 'http-status-codes'
import { Logger } from '../../config/commons'
import { Mongoose } from '../../config/mongoose'
import { Company } from '../models'
import { ICompany } from '../interfaces'
import { shared } from '../helpers/errors'
import { Container } from 'typedi'

export class UserIntegration {
  private mongoose: Mongoose

  constructor() {
    this.mongoose = Container.get(Mongoose)
    this.mongoose.connect()
  }

  async current(params): Promise<ICompany[]> {
    try {
      const response: ICompany[] = await Company.find(params)

      return response
    } catch (error) {
      Logger.error(error)

      throw { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, errors: { message: shared.somethingWentWrong } }
    }
  }
}
