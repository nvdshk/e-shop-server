import mongoose, { Schema, model, Model } from 'mongoose'
import { IDevice } from '../interface/deviceInterface'

const deviceSchema = new Schema<IDevice>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    token: { type: String, unique: true },
    platform: { type: String },
  },
  { timestamps: true }
)

const Device: Model<IDevice> = model('Device', deviceSchema, 'devices')

export default Device
