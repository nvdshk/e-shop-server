import { Schema, model, Model } from 'mongoose'
import { IPayment } from '../interface/paymentInteface'

const paymentSchema = new Schema<IPayment>({
  orderId: {
    type: String,
    required: true,
  },
  receiptId: {
    type: String,
  },
  paymentId: {
    type: String,
  },
  signature: {
    type: String,
  },
  amount: {
    type: String,
  },
  currency: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
})

const Payment: Model<IPayment> = model('Payment', paymentSchema)

export default Payment
