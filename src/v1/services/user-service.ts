import * as HttpStatus from 'http-status-codes'
import { Container } from 'typedi'
import { log, Logger } from '../../config/commons'
import { UserIntegration } from '../integrations'
import { ISignIn, IUser, IAuth, IRefreshToken } from '../interfaces'
import { errors } from '../helpers/errors'
import { compareHash, decodeAccessToken, decodeRefreshToken, encodeJWT } from '../helpers/security'

export class UserService {
  private userIntegration: UserIntegration

  constructor() {
    this.userIntegration = Container.get(UserIntegration)
  }

  @log
  private async getUserById(id: string): Promise<IUser> {
    const user: IUser = await this.userIntegration.findOne({ _id: id })

    if (!user) {
      throw { statusCode: HttpStatus.UNAUTHORIZED, errors: { message: errors.user.unauthorizerd } }
    }

    return user
  }

  @log
  async signIn(params: ISignIn): Promise<IAuth> {
    try {
      const { email, password } = params

      if (!email) {
        throw { statusCode: HttpStatus.BAD_REQUEST, errors: { message: errors.shared.fieldNotFound('E-mail') } }
      }

      if (!password) {
        throw { statusCode: HttpStatus.BAD_REQUEST, errors: { message: errors.shared.fieldNotFound('Senha') } }
      }

      const user: IUser = await this.userIntegration.findOne({ email })

      if (!user) {
        throw { statusCode: HttpStatus.UNAUTHORIZED, errors: { message: errors.user.invalidUsernameOrPassword } }
      }

      if (!compareHash(password, user.password)) {
        throw { statusCode: HttpStatus.UNAUTHORIZED, errors: { message: errors.user.invalidUsernameOrPassword } }
      }

      const { accessToken, refreshToken } = encodeJWT(user.id as string)

      return { user, accessToken, refreshToken }
    } catch (error) {
      Logger.error(error)

      throw {
        statusCode: error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        errors: error.errors || { message: errors.shared.somethingWentWrong },
      }
    }
  }

  @log
  async currentUser(): Promise<IUser> {
    try {
      const decoded = decodeAccessToken()

      if (!decoded) {
        throw { statusCode: HttpStatus.UNAUTHORIZED, errors: { message: errors.user.unauthorizerd } }
      }

      const user: IUser = await this.getUserById(decoded.sub)

      return user
    } catch (error) {
      Logger.error(error)

      throw {
        statusCode: error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        errors: error.errors || { message: errors.shared.somethingWentWrong },
      }
    }
  }

  @log
  async refreshToken(params: IRefreshToken): Promise<IAuth> {
    try {
      if (!params.refreshToken) {
        throw { statusCode: HttpStatus.BAD_REQUEST, errors: { message: errors.shared.fieldNotFound('refreshToken') } }
      }

      const decoded = decodeRefreshToken(params.refreshToken)

      if (!decoded) {
        throw { statusCode: HttpStatus.UNAUTHORIZED, errors: { message: errors.user.unauthorizerd } }
      }

      const user: IUser = await this.getUserById(decoded.sub)

      const { accessToken, refreshToken } = encodeJWT(user.id as string)

      return { user, accessToken, refreshToken }
    } catch (error) {
      Logger.error(error)

      throw {
        statusCode: error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        errors: error.errors || { message: errors.shared.somethingWentWrong },
      }
    }
  }
}
