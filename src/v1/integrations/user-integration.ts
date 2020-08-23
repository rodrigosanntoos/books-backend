import * as HttpStatus from 'http-status-codes'
import { User } from '../models'
import { IUser } from '../interfaces'
import { errors } from '../helpers/errors'
import { log, Logger } from '../../config/commons'

export class UserIntegration {
  @log
  async findOne(params): Promise<IUser> {
    try {
      const user: IUser = await User.findOne(params)

      return user
    } catch (error) {
      Logger.error(error)

      throw { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, errors: { message: errors.shared.somethingWentWrong } }
    }
  }
}
