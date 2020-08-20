import * as express from 'express'
import { Container } from 'typedi'
import { BookController } from '../controllers'

const book = Container.get(BookController)
const books = express.Router()

books.get('/', book.list)
books.get('/:id', book.get)

export { books }
