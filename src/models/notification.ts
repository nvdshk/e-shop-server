import mongoose, { Schema, model, Model } from 'mongoose'
import { INotification } from '../interface/notificationInteface'

const notificationSchema = new Schema<INotification>({
  message: {
    notification: {
      title: { type: String, required: true },
      body: { type: String, required: true },
      image: { type: String },
    },
    token: { type: String },
    tokens: { type: [String] },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  sent: { type: Boolean, required: true },
  error: { type: String },
  date: { type: Date, required: true },
})

const Notification: Model<INotification> = model(
  'Notification',
  notificationSchema
)

export default Notification
