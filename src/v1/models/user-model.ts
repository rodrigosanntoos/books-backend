import { Schema, model, models } from 'mongoose'
import { IUser } from '../interfaces'

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, required: true },
    birthdate: { type: String, required: true },
  },
  {
    timestamps: false,
    collection: 'users',
  },
)

UserSchema.methods.toJSON = function castToJSON() {
  const obj = this.toObject()
  obj.id = obj._id
  delete obj._id
  delete obj.password
  delete obj.__v
  return obj
}

export const User = models.User || model<IUser>('User', UserSchema)
