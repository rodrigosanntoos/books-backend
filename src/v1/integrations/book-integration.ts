import * as HttpStatus from 'http-status-codes'
import { log, Logger } from '../../config/commons'
import { Book } from '../models'
import { IBook, IListCompaniesInput } from '../interfaces'
import { errors } from '../helpers/errors'

export class BookIntegration {
  @log
  async find(params: IListCompaniesInput): Promise<IBook[]> {
    try {
      const { page, perPage, ...payload } = params

      const response: IBook[] = await Book.find(payload)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ title: 1 })

      return response
    } catch (error) {
      Logger.error(error)

      throw { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, errors: { message: errors.shared.somethingWentWrong } }
    }
  }

  @log
  async findById(id: string): Promise<IBook> {
    try {
      const response: IBook = await Book.findById(id)

      return response
    } catch (error) {
      Logger.error(error)

      throw { statusCode: HttpStatus.NOT_FOUND, errors: { message: errors.book.notFound } }
    }
  }
}
