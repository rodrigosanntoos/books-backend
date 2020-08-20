import { connect as mongooseConnect, disconnect as mongooseDisconnect } from 'mongoose'
import * as moment from 'moment'
import * as faker from 'faker'
import { Book } from '../../v1/models/book-model'
import { generateHash } from '../../v1/helpers/security'
import { User } from '../../v1/models'

const populateCompanies = async () => {
  try {
    console.log('Populate Companies!')

    const books = new Array(50).fill(null).map(e => ({
      title: faker.lorem.words(faker.random.number({ min: 1, max: 3 })),
      authors: new Array(faker.random.number({ min: 1, max: 3 })).fill(null).map(e => faker.name.findName()),
      pageCount: faker.random.number({ min: 45, max: 555 }),
      categories: new Array(faker.random.number({ min: 1, max: 3 })).fill(null).map(e => faker.lorem.word()),
      publisher: faker.company.companyName(),
      publishedDate: faker.date.past(),
    }))

    await Book.insertMany(books)
  } catch (error) {
    console.error(error)
  }
}

const populateUsers = async () => {
  try {
    console.log('Populate Users!')

    const users = [
      {
        name: faker.name.findName(),
        email: 'desafio@ioasys.com.br',
        birthdate: moment(faker.date.past()).format('YYYY-MM-DD'),
        gender: 'M',
        password: generateHash('12341234'),
      },
    ]

    await User.insertMany(users)
  } catch (error) {
    console.error(error)
  }
}

const runPopulate = async () => {
  try {
    await mongooseConnect('mongodb://localhost:27017/books-dev', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    console.log('Mongoose connected!')

    await populateCompanies()
    await populateUsers()

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
