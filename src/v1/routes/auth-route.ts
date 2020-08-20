import * as express from 'express'
import { Container } from 'typedi'
import { UserController } from '../controllers'

const user = Container.get(UserController)
const auths = express.Router()

auths.post('/sign-in', user.signIn)

export { auths }
