import { Request, Response, NextFunction } from 'express'
import Product from '../models/Product'
import CustomErrorHandler from '../services/CustomErrorHandler'
import productSchema from '../validators/productValidator'

const productContoller = {
  async findAll(req: Request, res: Response, next: NextFunction) {
    const categoriesId = req.query.categoriesId
    const filter = categoriesId ? { categories: categoriesId } : {}

    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize.toString())
      : 0
    const page = req.query.page ? parseInt(req.query.page.toString()) : 0

    try {
      const response = await Product.find(filter)
        .select('-updatedAt -__v')
        .limit(pageSize)
        .skip(pageSize * page)
        .sort({ createdAt: -1 })

      return res.status(200).json({
        success: true,
        data: response,
      })
    } catch (error) {
      return next(error)
    }
  },

  async findOne(req: Request, res: Response, next: NextFunction) {
    const productId = req.params.id
    try {
      const response = await Product.findById(productId).select(
        '-updatedAt -__v'
      )

      return res.status(200).json({
        success: true,
        data: response,
      })
    } catch (error) {
      return next(CustomErrorHandler.serverError())
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    const { error } = productSchema.validate(req.body)

    if (error) {
      next(error)
    }

    const {
      name,
      image,
      color,
      size,
      price,
      description,
      features,
      stock,
      tax,
      categories,
    } = req.body

    try {
      const response = await Product.create({
        name,
        image,
        color,
        price,
        size,
        stock,
        description,
        features,
        tax,
        categories,
      })
      return res.status(201).json({
        success: true,
        data: response,
      })
    } catch (error) {
      return next(error)
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    const { error } = productSchema.validate(req.body)

    if (error) {
      next(error)
    }

    const {
      name,
      image,
      color,
      size,
      price,
      description,
      categories,
      stock,
      tax,
      features,
    } = req.body
    const productId = req.params.id
    try {
      const response = await Product.findByIdAndUpdate(productId, {
        name,
        image,
        color,
        price,
        size,
        description,
        categories,
        stock,
        tax,
        features,
      })
      return res.status(200).json({
        success: true,
        data: response,
      })
    } catch (error) {
      return next(error)
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    const productId = req.params.id
    try {
      const response = await Product.findByIdAndRemove(productId)
      if (!response) {
        return next(new Error('Nothing to delete'))
      }
      res.json(response)
    } catch (error) {
      return next(error)
    }
  },
}

export default productContoller
