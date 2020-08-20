import * as HttpStatus from 'http-status-codes'
import { Logger } from '../../config/commons'
import { User } from '../models'
import { IUser } from '../interfaces'
import { shared } from '../helpers/errors'

export class UserIntegration {
  async findOne(params): Promise<IUser> {
    try {
      Logger.info(params)
      const user: IUser = await User.findOne(params)
      Logger.info(user)

      return user
    } catch (error) {
      Logger.error(error)

      throw { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, errors: { message: shared.somethingWentWrong } }
    }
  }
}
