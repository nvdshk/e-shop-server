import mongoose, { Document } from 'mongoose'

export interface ISetting extends Document {
  store: IStore
  currency: [ICurrency]
}

interface IStore extends Document {
  name: string
  logo: string
  contactNo: string
  address: string
}
interface ICurrency extends Document {
  name: string
  symbol: string
  code: string
  exchangeRate: string
}
