import { Schema, model, models } from 'mongoose'
import { ICompany } from '../interfaces'

const CompanySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: false,
    collection: 'companies',
  },
)

CompanySchema.methods.toJSON = function castToJSON() {
  const obj = this.toObject()
  obj.id = obj._id
  delete obj._id
  delete obj.__v
  return obj
}

export const Company = models.Company || model<ICompany>('Company', CompanySchema)
