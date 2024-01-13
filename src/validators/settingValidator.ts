import Joi from 'joi'

const storeSchema = Joi.object({
  name: Joi.string().required(),
  logo: Joi.string().required(),
  contactNo: Joi.string().required(),
  address: Joi.string().required(),
})
const settingSchema = Joi.object({
  store: storeSchema,
  currency: Joi.string().required(),
})

export default settingSchema
