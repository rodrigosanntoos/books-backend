import * as express from 'express'
import { Container } from 'typedi'
import { CompanyController } from '../controllers'

const company = Container.get(CompanyController)
const companies = express.Router()

companies.get('/', company.list)
companies.get('/:id', company.get)

export { companies }
