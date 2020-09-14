import { IUser } from './user-interface'

export interface IEncodeJWT {
  sub: string
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
  vld: number
  iat: number
}

export interface IRefreshToken {
  refreshToken: string
}
