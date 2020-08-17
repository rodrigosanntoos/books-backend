import { Document } from 'mongoose'

export interface ICompany extends Document {
  name: string
}

export interface IListCompaniesInput {
  page: number
  perPage: number
}

export interface IGetCompanyInput {
  id: string
}
