import mongoose, { Schema, model, Model } from 'mongoose'
import { IAddress } from '../interface/addressInterface'
import { ISetting } from '../interface/settingInteface'

const storeSchema = new mongoose.Schema({
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
})

const currencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  exchangeRate: {
    type: String,
    required: true,
  },
})
const settingSchema = new mongoose.Schema({
  store: storeSchema,

  currency: [currencySchema],
})

const Setting = mongoose.model<ISetting>('Setting', settingSchema)

export default Setting
