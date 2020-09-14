import { connect as mongooseConnect, disconnect as mongooseDisconnect } from 'mongoose'
import * as moment from 'moment'
import * as faker from 'faker/locale/pt_BR'
import { Book } from '../../v1/models/book-model'
import { Security } from '../../v1/helpers/security'
import { User } from '../../v1/models'
import { BookCategories } from '../../v1/helpers/enums'
import Container from 'typedi'

const populateBooks = async () => {
  try {
    console.log('Populate Books!')

    const books = new Array(500).fill(null).map(e => {
      return {
        title: faker.lorem.sentence(faker.random.number({ min: 1, max: 3 })).replace(/\./g, ''),
        subtitle: faker.lorem.sentence(faker.random.number({ min: 3, max: 6 })).replace(/\./g, ''),
        description: faker.lorem.paragraphs(2),
        pageCount: faker.random.number({ min: 45, max: 2342 }),
        category: Object.keys(BookCategories)[faker.random.number({ min: 0, max: 17 })],
        authors: new Array(faker.random.number({ min: 1, max: 3 })).fill(null).map(e => faker.name.findName()),
        imageUrl: faker.random.number({ min: 1, max: 5 }) !== 5 ? faker.image.cats(200, 400) : '',
        publisher: faker.company.companyName(),
        published: faker.date.past(30),
      }
    })

    await Book.insertMany(books)
  } catch (error) {
    console.error(error)
  }
}

const populateUsers = async () => {
  try {
    console.log('Populate Users!')

    const security = Container.get(Security)

    const users = [
      {
        name: faker.name.findName(),
        email: 'desafio@ioasys.com.br',
        birthdate: moment(faker.date.past()).format('YYYY-MM-DD'),
        gender: 'M',
        password: security.generateHash('12341234'),
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

    await populateBooks()
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
