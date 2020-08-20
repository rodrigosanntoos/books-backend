import * as HttpStatus from 'http-status-codes'
import { Container } from 'typedi'
import { Logger } from '../../config/commons'
import { UserIntegration } from '../integrations'
import { ISignIn, IUser, IAuth } from '../interfaces'
import { shared } from '../helpers/errors'
import { compareHash, decodeJwt, encodeJWT } from '../helpers/security'
import { AuthHeaders } from '../helpers/enums'

export class UserService {
  private userIntegration: UserIntegration

  constructor() {
    this.userIntegration = Container.get(UserIntegration)
  }

  async signIn(params: ISignIn): Promise<IAuth> {
    try {
      const { email, password } = params

      if (!email) {
        throw { statusCode: HttpStatus.BAD_REQUEST, errors: { message: 'Email não enviado.' } }
      }

      if (!password) {
        throw { statusCode: HttpStatus.BAD_REQUEST, errors: { message: 'Senha não enviada.' } }
      }

      const user: IUser = await this.userIntegration.findOne({ email })

      if (!user) {
        throw { statusCode: HttpStatus.UNAUTHORIZED, errors: { message: 'Usuário ou senha inválida1.' } }
      }

      if (!compareHash(password, user.password)) {
        throw { statusCode: HttpStatus.UNAUTHORIZED, errors: { message: 'Usuário ou senha inválida2.' } }
      }

      const token = encodeJWT(user.id as string)

      return { user, token }
    } catch (error) {
      Logger.error(error)

      throw {
        statusCode: error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        errors: error.errors || { message: shared.somethingWentWrong },
      }
    }
  }

  async currentUser(): Promise<IUser> {
    try {
      const token = decodeJwt(Container.get(AuthHeaders.Authorization))

      if (!token) {
        throw { statusCode: HttpStatus.UNAUTHORIZED, errors: { message: 'Não autorizado.' } }
      }

      const user: IUser = await this.userIntegration.findOne({ _id: token.sub })

      if (!user) {
        throw { statusCode: HttpStatus.UNAUTHORIZED, errors: { message: 'Não autorizado.' } }
      }

      return user
    } catch (error) {
      Logger.error(error)

      throw {
        statusCode: error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        errors: error.errors || { message: shared.somethingWentWrong },
      }
    }
  }
}
