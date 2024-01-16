import Joi from 'joi'

const productSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().required(),
  color: Joi.string().required(),
  price: Joi.number().required(),
  size: Joi.array().items(Joi.string()).required(),
  description: Joi.string().required(),
  features: Joi.array().items(Joi.string()).required(),
  images: Joi.array().items(Joi.string()),
  stock: Joi.number().required(),
  tax: Joi.number().required(),
  categories: Joi.array().required(),
})

export default productSchema
