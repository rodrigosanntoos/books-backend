import { Schema, model, models } from 'mongoose'
import { IBook } from '../interfaces'
import { BookCategories } from '../helpers/enums'

const BookSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    pageCount: { type: Number, required: true },
    category: { type: String, enum: Object.keys(BookCategories), required: true },
    authors: [{ type: String, required: true }],
    imageUrl: { type: String, required: false },
    publisher: { type: String, required: true },
    published: { type: Date, required: true },
  },
  {
    timestamps: false,
    collection: 'books',
  },
)

BookSchema.methods.toJSON = function castToJSON() {
  const obj = this.toObject()
  obj.id = obj._id
  obj.category = BookCategories[obj.category]
  delete obj._id
  delete obj.__v
  return obj
}

export const Book = models.Book || model<IBook>('Book', BookSchema)
