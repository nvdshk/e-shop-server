import Joi from 'joi'

const storeSchema = Joi.object({
  name: Joi.string().required(),
  logo: Joi.string().required(),
  contactNo: Joi.string().required(),
  address: Joi.string().required(),
})

export const currencySchema = Joi.object({
  name: Joi.string().required(),
  symbol: Joi.string().required(),
  code: Joi.string().required(),
  exchangeRate: Joi.string().required(),
})

export default storeSchema
