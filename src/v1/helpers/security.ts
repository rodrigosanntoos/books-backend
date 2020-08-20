import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import CONFIG from '../../config/env'
import { IJwt } from '../interfaces'
import { Logger } from '../../config/commons'

const EXPIRATION = 1000 * 60 * 60 * 24

export function encodeJWT(subject: string) {
  const token: string = jwt.sign({ sub: subject, iat: Date.now() }, CONFIG.jwtSecret)
  return token
}

export const generateHash = (password: string) => {
  return bcrypt.hashSync(password, 10)
}

export const compareHash = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash)
}

export const decodeJwt = (token: string) => {
  if (!token) return null

  try {
    const decodedJWT: IJwt = jwt.verify(token.split(' ')[1], CONFIG.jwtSecret) as IJwt

    if (!decodedJWT.sub) {
      return null
    }

    // Check if token is expired
    if (Date.now() > decodedJWT.iat + EXPIRATION) {
      return null
    }

    return decodedJWT
  } catch (err) {
    console.log(err)
    return null
  }
}
