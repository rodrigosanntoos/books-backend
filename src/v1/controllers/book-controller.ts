import { Request, Response } from 'express'
import * as HttpStatus from 'http-status-codes'
import { Container } from 'typedi'
import { Logger } from '../../config/commons'
import { BookService } from '../services'
import { IBook, IBookFind, IGetBookInput, IListCompaniesInput } from '../interfaces'
import { errors } from '../helpers/errors'

export class BookController {
  async list(req: Request, res: Response) {
    try {
      const params: IListCompaniesInput = {
        page: parseInt(req.query.page as string, 10),
        perPage: req.query['per-page'] ? parseInt(req.query['per-page'] as string, 10) : 10,
      }

      const bookService = Container.get(BookService)
      const response: IBookFind = await bookService.list(params)

      return res.status(HttpStatus.OK).json(response)
    } catch (error) {
      Logger.error(error)

      res.status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.errors || { message: errors.shared.somethingWentWrong },
      })
    }
  }

  async get(req: Request, res: Response) {
    try {
      const params: IGetBookInput = {
        id: req.params.id as string,
      }

      const bookService = Container.get(BookService)
      const book: IBook = await bookService.get(params)

      return res.status(HttpStatus.OK).json(book)
    } catch (error) {
      Logger.error(error)

      res.status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.errors || { message: errors.shared.somethingWentWrong },
      })
    }
  }
}
