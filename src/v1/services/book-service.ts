import * as HttpStatus from 'http-status-codes'
import { Container } from 'typedi'
import { log, Logger } from '../../config/commons'
import { BookIntegration } from '../integrations'
import { IBook, IGetBookInput } from '../interfaces'
import { errors } from '../helpers/errors'
import { IBookFind, IListCompaniesInput } from '../interfaces/book-interface'

export class BookService {
  private bookIntegration: BookIntegration

  constructor() {
    this.bookIntegration = Container.get(BookIntegration)
  }

  @log
  async list(params: IListCompaniesInput): Promise<IBookFind> {
    try {
      const { page, perPage } = params

      if (!page) {
        throw { statusCode: HttpStatus.BAD_REQUEST, errors: { message: errors.shared.queryParameterMissing('page') } }
      }

      if (!perPage) {
        throw {
          statusCode: HttpStatus.BAD_REQUEST,
          errors: { message: errors.shared.queryParameterMissing('per-page') },
        }
      }

      const response: IBookFind = await this.bookIntegration.find(params)

      return response
    } catch (error) {
      Logger.error(error)

      throw {
        statusCode: error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        errors: error.errors || { message: errors.shared.somethingWentWrong },
      }
    }
  }

  @log
  async get(params: IGetBookInput): Promise<IBook> {
    try {
      const { id } = params

      const book: IBook = await this.bookIntegration.findById(id)

      return book
    } catch (error) {
      Logger.error(error)

      throw {
        statusCode: error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        errors: error.errors || { message: errors.shared.somethingWentWrong },
      }
    }
  }
}
