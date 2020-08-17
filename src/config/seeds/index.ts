import { connect as mongooseConnect, disconnect as mongooseDisconnect } from 'mongoose'
import * as faker from 'faker'
import { ICompany } from '../../v1/interfaces'
import { Company } from '../../v1/models/company-model'

faker.locale = 'pt_BR'

const populateCompanies = async () => {
  try {
    const companies: ICompany[] = new Array(50).fill(null).map(e => ({
      name: faker.company.companyName(0),
    }))

    await Company.insertMany(companies)
  } catch (error) {
    console.error(error)
  }
}

const runPopulate = async () => {
  try {
    await mongooseConnect('mongodb://localhost:27017/companies-dev', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    console.log('Mongoose connected!')

    await populateCompanies()

    await mongooseDisconnect()
    console.log('Mongoose disconnected!')
  } catch (error) {
    console.error(error)
  }
}

runPopulate()
  .then(() => {
    console.log('Seed finished')
    process.exit(0)
    return
  })
  .catch(e => {
    console.log('Seed failed: ', e)
    process.exit(0)
    return
  })
