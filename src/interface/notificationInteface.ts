import mongoose from 'mongoose'

export interface INotification {
  message: {
    notification: {
      title: string
      body: string
    }
    token?: string
    tokens: [string]
  }
  user?: mongoose.Schema.Types.ObjectId
  sent: boolean
  error: string
  date: Date
}
