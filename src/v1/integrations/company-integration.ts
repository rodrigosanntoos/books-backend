import * as HttpStatus from 'http-status-codes'
import { Logger } from '../../config/commons'
import { Company } from '../models'
import { ICompany, IListCompaniesInput } from '../interfaces'
import { company, shared } from '../helpers/errors'

export class CompanyIntegration {
  async find(params: IListCompaniesInput): Promise<ICompany[]> {
    try {
      const { page, perPage, ...payload } = params

      const response: ICompany[] = await Company.find(payload)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ name: 1 })

      return response
    } catch (error) {
      Logger.error(error)

      throw { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, errors: { message: shared.somethingWentWrong } }
    }
  }

  async findById(id: string): Promise<ICompany> {
    try {
      const response: ICompany = await Company.findById(id)

      return response
    } catch (error) {
      Logger.error(error)

      throw { statusCode: HttpStatus.NOT_FOUND, errors: { message: company.notFound } }
    }
  }
}
