import mongoose, { Schema, model, Model } from 'mongoose'
import { ICart, IItem } from '../interface/cartInterface'

const itemSchema = new Schema<IItem>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
    taxIncludeTotal: { type: Number, required: true },
  },
  { timestamps: true }
)

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [itemSchema],
  },
  { timestamps: true }
)

const Cart: Model<ICart> = model('Cart', cartSchema)

export default Cart
