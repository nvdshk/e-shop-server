import { Schema, model, Model } from 'mongoose'
import { ICategory } from '../interface/categoryInterface'

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    parentId: { type: String },
  },
  { timestamps: true }
)

const Category: Model<ICategory> = model('Category', categorySchema)

export default Category
