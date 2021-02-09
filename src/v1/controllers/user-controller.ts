import { Request, Response } from 'express'
import * as HttpStatus from 'http-status-codes'
import { Container } from 'typedi'
import { Logger } from '../../config/commons'
import { UserService } from '../services'
import { ISignIn, IAuth, IRefreshToken } from '../interfaces'
import { errors } from '../helpers/errors'

export class UserController {
  async signIn(req: Request, res: Response) {
    try {
      const params: ISignIn = {
        email: req.body.email as string,
        password: req.body.password as string,
      }

      const userService = Container.get(UserService)
      const auth: IAuth = await userService.signIn(params)

      return res
        .status(HttpStatus.OK)
        .header('Authorization', auth.accessToken)
        .header('refresh-token', auth.refreshToken)
        .json(auth.user)
    } catch (error) {
      Logger.error(error)

      res.status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.errors || { message: errors.shared.somethingWentWrong },
      })
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const params: IRefreshToken = {
        refreshToken: req.body.refreshToken as string,
      }

      const userService = Container.get(UserService)
      const auth: IAuth = await userService.refreshToken(params)

      return res
        .status(HttpStatus.NO_CONTENT)
        .header('Authorization', auth.accessToken)
        .header('refresh-token', auth.refreshToken)
        .end()
    } catch (error) {
      Logger.error(error)

      res.status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.errors || { message: errors.shared.somethingWentWrong },
      })
    }
  }
}
