import mongoose, { Document } from 'mongoose'

export interface IDevice extends Document {
  user: mongoose.Schema.Types.ObjectId
  token: string
  platform: string
}
