import mongoose, { Document } from 'mongoose'

export interface ICart extends Document {
  userId: mongoose.Schema.Types.ObjectId
  items: [IItem]
}

export interface IItem extends Document {
  product: mongoose.Schema.Types.ObjectId
  quantity: number
  price: number
  total: number
}
