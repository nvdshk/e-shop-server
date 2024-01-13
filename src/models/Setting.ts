import mongoose, { Schema, model, Model } from 'mongoose'
import { IAddress } from '../interface/addressInterface'
import { ISetting } from '../interface/settingInteface'

const settingSchema = new mongoose.Schema({
  store: {
    type: {
      name: {
        type: String,
        required: true,
      },
      logo: {
        type: String,
        required: true,
      },
      contactNo: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
})

const Setting = mongoose.model<ISetting>('Setting', settingSchema)

export default Setting
