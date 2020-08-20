import { Document } from 'mongoose'

export interface IBook extends Document {
  id?: string
  title: string
  authors: string[]
  pageCount: number
  categories: string[]
  publisher: string
  publishedDate: Date
}

export interface IListCompaniesInput {
  page: number
  perPage: number
}

export interface IGetBookInput {
  id: string
}
