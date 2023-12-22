import mongoose, { Document } from 'mongoose'
export interface IProduct extends Document {
  name: string
  image: string
  color: string
  price: number
  size: [string]
  description: string
  images: [string]
  features: [string]
  stock: number
  categories: []
  createdBy: mongoose.Schema.Types.ObjectId
}
