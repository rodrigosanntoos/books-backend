import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'

const EXPIRATION = 1000 * 60 * 60 * 24

export function encodeJWT(subject: string) {
  const token = jwt.sign({ sub: subject, iat: Date.now() }, process.env.JWT_SECRET)
  return `JWT ${token}`
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
    const decodedJWT = jwt.verify(token.substring(4), process.env.JWT_SECRET as string)

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
