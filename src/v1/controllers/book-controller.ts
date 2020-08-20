import { Request, Response } from 'express'
import * as HttpStatus from 'http-status-codes'
import { Container } from 'typedi'
import { Logger } from '../../config/commons'
import { BookService } from '../services'
import { IBook, IGetBookInput, IListCompaniesInput } from '../interfaces'
import { shared } from '../helpers/errors'

export class BookController {
  async list(req: Request, res: Response) {
    try {
      const params: IListCompaniesInput = {
        page: parseInt(req.query.page as string, 10) || 0,
        perPage: parseInt(req.query.perPage as string, 10) || 10,
      }

      Logger.info(params)

      const bookService = Container.get(BookService)
      const books: IBook[] = await bookService.list(params)

      return res.status(HttpStatus.OK).json(books)
    } catch (error) {
      Logger.error(error)

      res.status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: error.errors || { message: shared.somethingWentWrong },
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
        errors: error.errors || { message: shared.somethingWentWrong },
      })
    }
  }
}
