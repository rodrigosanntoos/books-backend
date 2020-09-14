import * as HttpStatus from 'http-status-codes'
import { log, Logger } from '../../config/commons'
import { Book } from '../models'
import { IBook, IListCompaniesInput, IBookFind } from '../interfaces'
import { errors } from '../helpers/errors'

export class BookIntegration {
  @log
  async find(params: IListCompaniesInput): Promise<IBookFind> {
    try {
      const { page, perPage, ...payload } = params

      const data: Array<IBook> = await Book.find(payload)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ title: 1 })

      const totalItems: number = await Book.count(payload)

      return { data, page, totalItems, totalPages: totalItems / perPage }
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
