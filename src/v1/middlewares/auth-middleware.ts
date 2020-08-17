import { NextFunction, Request, Response } from 'express'
import { Container } from 'typedi'
import { Logger } from '../../config/commons'
// import { UserIntegration } from '../integrations'
import { AuthHeaders } from '../helpers/enums'
import * as HttpStatus from 'http-status-codes'
import { shared } from '../helpers/errors'

export class AuthMiddleware {
  // private userIntegration: UserIntegration

  constructor() {
    // this.userIntegration = Container.get(UserIntegration)
  }

  private getAuthorization(authorization: string | string[] | undefined) {
    try {
      if (!authorization) {
        throw { statusCode: HttpStatus.BAD_REQUEST, errors: { message: shared.headerMissing('authorization') } }
      }

      Container.set(AuthHeaders.Authorization, authorization)
    } catch (error) {
      Logger.error(error)

      throw error
    }
  }

  private getResourceType(resourceType: string | string[] | undefined) {
    try {
      if (!resourceType) {
        throw { statusCode: HttpStatus.BAD_REQUEST, errors: { message: shared.headerMissing('resource-type') } }
      }

      Container.set(AuthHeaders.ResourceType, resourceType)
    } catch (error) {
      Logger.error(error)

      throw error
    }
  }

  private async currentPatient() {
    try {
      // Container.set(AuthContext.CurrentUser, null)
      // const currentPatient: ICurrentPatient = await this.userIntegration.getCurrent(true)
      // LoggerContext.setLogInfoData(AuthContext.PatientId, currentPatient.id)
      // LoggerContext.setLogInfoData(AuthContext.TaxId, currentPatient.taxId)
      // Container.set(AuthContext.CurrentUser, currentPatient)
    } catch (error) {
      Logger.error(error)

      throw error
    }
  }

  async handler(req: Request, res: Response, next: NextFunction) {
    try {
      this.getAuthorization(req.headers?.authorization)
      this.getResourceType(req.headers?.['resource-type'])

      await this.currentPatient()

      return next()
    } catch (error) {
      Logger.error(error)

      return res.status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.errors || { message: shared.somethingWentWrong },
      })
    }
  }
}
