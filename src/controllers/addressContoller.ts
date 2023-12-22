import { Request, Response, NextFunction } from 'express'
import Address from '../models/address'
import User from '../models/User'
import CustomErrorHandler from '../services/CustomErrorHandler'

const addressController = {
  async create(req: Request, res: Response, next: NextFunction) {
    const userId = req.user._id
    const address = req.body

    if (address.id) {
      const add = await Address.findOne({
        user: userId,
        'address._id': address.id,
      })

      if (!add) {
        return next(CustomErrorHandler.notFound())
      }
    }

    try {
      if (address.id) {
        const response = await Address.findOneAndUpdate(
          { user: userId, 'address._id': address.id },
          {
            $set: {
              'address.$': address,
            },
          },
          { new: true }
        ).select({ user: 0, __v: 0 })

        return res.status(200).json({ sucess: true })
      } else {
        const response = await Address.findOneAndUpdate(
          { user: userId },
          {
            $push: {
              address: address,
            },
          },
          { new: true, upsert: true }
        ).select({ user: 0, __v: 0 })

        return res.status(201).json({ sucess: true, data: response })
      }
    } catch (error) {
      return next(error)
    }
  },

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await Address.findOne({ user: req.user._id })
      return res.status(200).json({ success: true, data: response })
    } catch (error) {
      return next(error)
    }
  },

  async findOne(req: Request, res: Response, next: NextFunction) {
    const userId = req.user._id
    const addressId = req.params.id

    try {
      const response = await Address.findOne(
        {
          user: userId,
          'address._id': addressId,
        },
        { 'address.$': 1 }
      )
      return res.status(200).json({
        success: true,
        data: response?.address[0],
      })
    } catch (error) {
      return next(error)
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    const userId = req.user._id
    const addressId = req.params.id

    try {
      const response = await Address.findOneAndUpdate(
        { user: userId },
        {
          $pull: {
            address: {
              _id: addressId,
            },
          },
        }
      )
      return res.status(202).json({ success: true })
    } catch (error) {
      return next(error)
    }
  },

  async findPrimaryAddress(req: Request, res: Response, next: NextFunction) {
    const userId = req.user._id
    const isPrimary = true
    try {
      const response = await Address.findOne(
        {
          user: userId,
          'address.isPrimary': isPrimary,
        },
        { 'address.$': 1 }
      ).select('-updatedAt -__v')

      return res.status(200).json({
        success: true,
        data: response?.address[0],
      })
    } catch (error) {
      return next(error)
    }
  },

  async updatePrimaryAddress(req: Request, res: Response, next: NextFunction) {
    const userId = req.user._id
    const addressId = req.body.id
    try {
      const response = await Address.findOne({ userId: userId })

      response?.address.forEach(function (doc) {
        console.log(doc._id == addressId)
        if (doc._id == addressId) {
          doc.isPrimary = true
        } else {
          doc.isPrimary = false
        }
      })

      response?.save()

      return res.status(200).json({
        success: true,
        data: response,
      })
    } catch (error) {
      return next(error)
    }
  },
}

export default addressController
