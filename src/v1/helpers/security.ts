import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { Container } from 'typedi'
import { Logger } from '../../config/commons'
import CONFIG from '../../config/env'
import { IEncodeJWT, IJwt } from '../interfaces'
import { AuthHeader } from './enums'

export class Security {
  public readonly ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 60 // expire in 1 hour
  public readonly REFRESH_TOKEN_EXPIRATION = 1000 * 60 * 60 * 4 // expire in 4 hours

  encodeJWT(params: IEncodeJWT): { accessToken: string; refreshToken: string } {
    const now = Date.now()

    const accessToken: string = jwt.sign(
      { ...params, vld: now, iat: now + this.ACCESS_TOKEN_EXPIRATION },
      CONFIG.accessTokenSecret,
    )

    const refreshToken: string = jwt.sign(
      { ...params, vld: now, iat: now + this.REFRESH_TOKEN_EXPIRATION },
      CONFIG.refreshTokenSecret,
    )

    return { accessToken, refreshToken }
  }

  generateHash(password: string): string {
    return bcrypt.hashSync(password, 10)
  }

  compareHash(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash)
  }

  decodeAccessToken(): IJwt | null {
    try {
      const accessToken: string = Container.get(AuthHeader.authorization)

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

  decodeRefreshToken(refreshToken: string): IJwt | null {
    try {
      const accessToken: string = Container.get(AuthHeader.authorization)

      if (!accessToken || !refreshToken) {
        return null
      }

      const decodedAccessToken: IJwt = jwt.verify(accessToken, CONFIG.accessTokenSecret) as IJwt

      if (!decodedAccessToken.sub) {
        return null
      }

      const decodedRefreshToken: IJwt = jwt.verify(refreshToken, CONFIG.refreshTokenSecret) as IJwt

      if (
        !decodedRefreshToken.sub ||
        decodedAccessToken.sub !== decodedRefreshToken.sub ||
        decodedAccessToken.vld !== decodedRefreshToken.vld ||
        decodedRefreshToken.iat < Date.now()
      ) {
        return null
      }

      return decodedRefreshToken
    } catch (error) {
      Logger.error(error)

      return null
    }
  }
}
