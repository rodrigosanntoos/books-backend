import { Document } from 'mongoose'

export interface IUser extends Document {
  id?: string
  name: string
  email: string
  password: string
  gender: string
  birthdate: string
}

export interface ISignIn {
  email: string
  password: string
}

export interface IAuth {
  user: IUser
  token: string
}

export interface IJwt {
  sub: string
  iat: number
}
