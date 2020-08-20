import { Request, Response } from 'express'
import * as HttpStatus from 'http-status-codes'
import { Container } from 'typedi'
import { Logger } from '../../config/commons'
import { UserService } from '../services'
import { ISignIn, IAuth } from '../interfaces'
import { shared } from '../helpers/errors'

export class UserController {
  async signIn(req: Request, res: Response) {
    try {
      Logger.info({ body: req.body })

      const params: ISignIn = {
        email: req.body.email as string,
        password: req.body.password as string,
      }

      const userService = Container.get(UserService)
      const auth: IAuth = await userService.signIn(params)

      return res.status(HttpStatus.OK).json(auth)
    } catch (error) {
      Logger.error(error)

      res.status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.errors || { message: shared.somethingWentWrong },
      })
    }
  }
}
