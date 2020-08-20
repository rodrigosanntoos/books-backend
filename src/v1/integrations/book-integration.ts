import * as HttpStatus from 'http-status-codes'
import { Logger } from '../../config/commons'
import { Book } from '../models'
import { IBook, IListCompaniesInput } from '../interfaces'
import { book, shared } from '../helpers/errors'

export class BookIntegration {
  async find(params: IListCompaniesInput): Promise<IBook[]> {
    try {
      const { page, perPage, ...payload } = params

      const response: IBook[] = await Book.find(payload)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ name: 1 })

      return response
    } catch (error) {
      Logger.error(error)

      throw { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, errors: { message: shared.somethingWentWrong } }
    }
  }

  async findById(id: string): Promise<IBook> {
    try {
      const response: IBook = await Book.findById(id)

      return response
    } catch (error) {
      Logger.error(error)

      throw { statusCode: HttpStatus.NOT_FOUND, errors: { message: book.notFound } }
    }
  }
}
