import mongoose, { Document } from 'mongoose'

export interface IAddress extends Document {
  user: mongoose.Schema.Types.ObjectId
  address: [IAddressItem]
}

export interface IAddressItem extends Document {
  name: string
  phoneNumber: string
  pincode: string
  locality: string
  houseAddress: string
  city: string
  state: string
  addressType: string
  landmark: string
  alternateNumber: string
  isPrimary: Boolean
}
