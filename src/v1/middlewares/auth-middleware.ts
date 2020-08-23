import { NextFunction, Request, Response } from 'express'
import { Container } from 'typedi'
import { Logger, LoggerContext } from '../../config/commons'
import { UserService } from '../services'
import { AuthContext, AuthHeader } from '../helpers/enums'
import * as HttpStatus from 'http-status-codes'
import { errors } from '../helpers/errors'
import { IUser } from '../interfaces'

export class AuthMiddleware {
  private userService: UserService

  constructor() {
    this.userService = Container.get(UserService)
  }

  private getAuthorization(authorization: string | string[] | undefined) {
    try {
      if (!authorization) {
        throw { statusCode: HttpStatus.BAD_REQUEST, errors: { message: errors.shared.headerMissing('authorization') } }
      }

      Container.set(AuthHeader.Authorization, authorization.toString().substring(7))
    } catch (error) {
      Logger.error(error)

      throw error
    }
  }

  private getResourceType(resourceType: string | string[] | undefined) {
    try {
      if (!resourceType) {
        throw { statusCode: HttpStatus.BAD_REQUEST, errors: { message: errors.shared.headerMissing('resource-type') } }
      }

      Container.set(AuthHeader.ResourceType, resourceType)
    } catch (error) {
      Logger.error(error)

      throw error
    }
  }

  private async currentPatient() {
    try {
      Container.set(AuthContext.CurrentUser, null)

      const currentUser: IUser = await this.userService.currentUser()

      LoggerContext.setLogInfoData(AuthContext.UserId, currentUser.id)

      Container.set(AuthContext.CurrentUser, currentUser)
    } catch (error) {
      Logger.error(error)

      throw error
    }
  }

  handler(options: { publicPath: { method: string; path: string }[] }) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (options.publicPath.find(route => route.path === req.path && route.method === req.method)) {
          return next()
        }

        this.getAuthorization(req.headers?.authorization)
        this.getResourceType(req.headers?.['resource-type'])

        await this.currentPatient()

        return next()
      } catch (error) {
        Logger.error(error)

        return res.status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
          errors: error.errors || { message: errors.shared.somethingWentWrong },
        })
      }
    }
  }
}
