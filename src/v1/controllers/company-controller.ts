import { Request, Response } from 'express'
import * as HttpStatus from 'http-status-codes'
import { Container } from 'typedi'
import { Logger } from '../../config/commons'
import { CompanyService } from '../services'
import { ICompany, IGetCompanyInput } from '../interfaces'
import { shared } from '../helpers/errors'
import { IListCompaniesInput } from '../interfaces/company-interface'

export class CompanyController {
  async list(req: Request, res: Response) {
    try {
      const params: IListCompaniesInput = {
        page: parseInt(req.query.page as string, 10) || 0,
        perPage: parseInt(req.query.perPage as string, 10) || 10,
      }

      const companyService = Container.get(CompanyService)
      const companies: ICompany[] = await companyService.list(params)

      return res.status(HttpStatus.OK).json(companies)
    } catch (error) {
      Logger.error(error)

      res.status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.errors || { message: shared.somethingWentWrong },
      })
    }
  }

  async get(req: Request, res: Response) {
    try {
      const params: IGetCompanyInput = {
        id: req.params.id as string,
      }

      const companyService = Container.get(CompanyService)
      const company: ICompany = await companyService.get(params)

      return res.status(HttpStatus.OK).json(company)
    } catch (error) {
      Logger.error(error)

      res.status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.errors || { message: shared.somethingWentWrong },
      })
    }
  }
}
