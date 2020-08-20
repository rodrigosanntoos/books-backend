import * as HttpStatus from 'http-status-codes'
import { Container } from 'typedi'
import { Logger } from '../../config/commons'
import { BookIntegration } from '../integrations'
import { IBook, IGetBookInput } from '../interfaces'
import { shared } from '../helpers/errors'
import { IListCompaniesInput } from '../interfaces/book-interface'

export class BookService {
  private bookIntegration: BookIntegration

  constructor() {
    this.bookIntegration = Container.get(BookIntegration)
  }

  async list(params: IListCompaniesInput): Promise<IBook[]> {
    try {
      const books: IBook[] = await this.bookIntegration.find(params)

      return books
    } catch (error) {
      Logger.error(error)

      throw {
        statusCode: error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        errors: error.errors || { message: shared.somethingWentWrong },
      }
    }
  }

  async get(params: IGetBookInput): Promise<IBook> {
    try {
      const { id } = params

      const book: IBook = await this.bookIntegration.findById(id)

      return book
    } catch (error) {
      Logger.error(error)

      throw {
        statusCode: error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        errors: error.errors || { message: shared.somethingWentWrong },
      }
    }
  }
}
