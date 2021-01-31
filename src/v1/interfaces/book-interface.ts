import { Document } from 'mongoose'
import { BookCategories } from '../helpers/enums'

export interface IBook extends Document {
  id?: string
  title: string
  subtitle: string
  description: string
  pageCount: number
  category: BookCategories
  authors: string[]
  imageUrl: string
  language: string
  isbn10: string
  isbn13: string
  publisher: string
  published: Date
}

export interface IListCompaniesInput {
  page: number
  amount: number
  category?: string
}

export interface IGetBookInput {
  id: string
}

export interface IBookFind {
  data: Array<IBook>
  page: number
  totalPages: number
  totalItems: number
}
