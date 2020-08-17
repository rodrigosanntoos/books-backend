import * as HttpStatus from 'http-status-codes'
import { Container } from 'typedi'
import { Logger } from '../../config/commons'
import { CompanyIntegration } from '../integrations'
import { ICompany, IGetCompanyInput } from '../interfaces'
import { shared } from '../helpers/errors'
import { IListCompaniesInput } from '../interfaces/company-interface'

export class CompanyService {
  private companyIntegration: CompanyIntegration

  constructor() {
    this.companyIntegration = Container.get(CompanyIntegration)
  }

  async list(params: IListCompaniesInput): Promise<ICompany[]> {
    try {
      const companies: ICompany[] = await this.companyIntegration.find(params)

      return companies
    } catch (error) {
      Logger.error(error)

      throw {
        statusCode: error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        errors: error.errors || { message: shared.somethingWentWrong },
      }
    }
  }

  async get(params: IGetCompanyInput): Promise<ICompany> {
    try {
      const { id } = params

      const company: ICompany = await this.companyIntegration.findById(id)

      return company
    } catch (error) {
      Logger.error(error)

      throw {
        statusCode: error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        errors: error.errors || { message: shared.somethingWentWrong },
      }
    }
  }
}
