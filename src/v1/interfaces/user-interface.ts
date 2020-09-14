import { Document } from 'mongoose'

export interface IUser extends Document {
  id?: string
  name: string
  email: string
  password: string
  gender: string
  birthdate: string
}
