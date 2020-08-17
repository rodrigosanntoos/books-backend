import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as dotenv from 'dotenv'
dotenv.config()
// import * as swaggerUi from 'swagger-ui-express'
// import swaggerDocs from '../swagger/index'
import * as routes from '../../v1/routes'
import { Route } from '../../v1/helpers/enums'

const app = express()
const port = 3001

dotenv.config()

app.set('port', process.env.PORT || port)
app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(bodyParser.raw())

app.use(
  cors({
    origin: '*',
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
)

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)

// app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

Object.keys(routes).forEach(key => app.use(`/api/v1/${Route[key]}`, routes[key]))

export default app
