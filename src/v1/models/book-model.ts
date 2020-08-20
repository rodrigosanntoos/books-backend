import { Schema, model, models } from 'mongoose'
import { IBook } from '../interfaces'

const BookSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    authors: [{ type: String, required: true }],
    pageCount: { type: Number, required: true },
    categories: [{ type: String, required: true }],
    publisher: { type: String, required: true },
    publishedDate: { type: Date, required: true },
  },
  {
    timestamps: false,
    collection: 'books',
  },
)

BookSchema.methods.toJSON = function castToJSON() {
  const obj = this.toObject()
  obj.id = obj._id
  delete obj._id
  delete obj.__v
  return obj
}

export const Book = models.Book || model<IBook>('Book', BookSchema)
