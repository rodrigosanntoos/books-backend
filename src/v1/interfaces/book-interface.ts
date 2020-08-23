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
  publisher: string
  published: Date
}

export interface IListCompaniesInput {
  page: number
  perPage: number
}

export interface IGetBookInput {
  id: string
}
