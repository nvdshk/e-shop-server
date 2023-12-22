import mongoose, { Document } from 'mongoose'
import { IAddressItem } from './addressInterface'
import { IItem } from './cartInterface'

export interface IOrder extends Document {
  user: mongoose.Schema.Types.ObjectId
  address: IAddressItem
  items: [IItem]
  totalAmount: number
  paymentType: string
  paymentStatus: string
  payment?: mongoose.Schema.Types.ObjectId
  orderStatus: [
    {
      type: string
      date: Date
      isCompleted: true
    }
  ]
}
