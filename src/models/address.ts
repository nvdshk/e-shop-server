import mongoose, { Schema, model, Model } from 'mongoose'
import { IAddress } from '../interface/addressInterface'

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  address: [
    {
      name: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
      locality: {
        type: String,
        required: true,
      },
      houseAddress: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      addressType: {
        type: String,
        required: true,
      },
      landmark: {
        type: String,
      },
      alternateNumber: {
        type: String,
      },
      isPrimary: {
        type: Boolean,
        default: false,
        required: true,
      },
    },
  ],
})

const Address = mongoose.model<IAddress>('Address', addressSchema)

export default Address
