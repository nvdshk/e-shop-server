import mongoose, { Schema, model, Model } from 'mongoose'
import { IProduct } from '../interface/productInterface'

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    color: { type: String, required: true },
    price: { type: Number, required: true },
    size: [{ type: String, required: true }],
    description: { type: String, required: true },
    features: [{ type: String, required: true }],
    images: [String],
    stock: { type: Number, required: true },
    tax: { type: Number, required: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

const Product: Model<IProduct> = model('Product', productSchema)

export default Product
