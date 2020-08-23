import { Container } from 'typedi'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import { IJwt } from '../interfaces'
import { AuthHeader } from '../helpers/enums'
import { Logger } from '../../config/commons'
import CONFIG from '../../config/env'

export function encodeJWT(subject: string): { accessToken: string; refreshToken: string } {
  const ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 60
  const REFRESH_TOKEN_EXPIRATION = 1000 * 60 * 60

  const accessToken: string = jwt.sign(
    { sub: subject, iat: Date.now() + ACCESS_TOKEN_EXPIRATION },
    CONFIG.accessTokenSecret,
  )

  const refreshToken: string = jwt.sign(
    { sub: subject, iat: Date.now() + REFRESH_TOKEN_EXPIRATION },
    CONFIG.refreshTokenSecret,
  )

  return { accessToken, refreshToken }
}

export const generateHash = (password: string): string => {
  return bcrypt.hashSync(password, 10)
}

export const compareHash = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash)
}

export const decodeAccessToken = (): IJwt | null => {
  try {
    const accessToken: string = Container.get(AuthHeader.Authorization)

    if (!accessToken) {
      return null
    }

    const decodedAccessToken: IJwt = jwt.verify(accessToken, CONFIG.accessTokenSecret) as IJwt

    if (!decodedAccessToken.sub || decodedAccessToken.iat < Date.now()) {
      return null
    }

    return decodedAccessToken
  } catch (error) {
    Logger.error(error)

    return null
  }
}

export const decodeRefreshToken = (refreshToken: string): IJwt | null => {
  try {
    const accessToken: string = Container.get(AuthHeader.Authorization)

    if (!accessToken || !refreshToken) {
      return null
    }

    const decodedAccessToken: IJwt = jwt.verify(accessToken, CONFIG.accessTokenSecret) as IJwt

    if (!decodedAccessToken.sub) {
      return null
    }

    const decodedRefreshToken: IJwt = jwt.verify(refreshToken, CONFIG.refreshTokenSecret) as IJwt

    if (!decodedRefreshToken.sub || decodedRefreshToken.iat < Date.now()) {
      return null
    }

    return decodedRefreshToken
  } catch (error) {
    Logger.error(error)

    return null
  }
}
