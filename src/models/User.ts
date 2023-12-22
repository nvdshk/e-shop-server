import { Schema, model, Model } from 'mongoose'
import { IUser } from '../interface/userInterface'

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const User: Model<IUser> = model('User', userSchema, 'users')

export default User
