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
  accessToken: string
  refreshToken: string
}

export interface IJwt {
  sub: string
  iat: number
}

export interface IRefreshToken {
  refreshToken: string
}
