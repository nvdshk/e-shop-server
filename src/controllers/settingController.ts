import { Request, Response, NextFunction, response } from 'express'
import CustomErrorHandler from '../services/CustomErrorHandler'
import Setting from '../models/Setting'
import settingSchema from '../validators/settingValidator'

const settingsController = {
  async find(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await Setting.find().select('-updatedAt -__v')

      if (!response) {
        return next(CustomErrorHandler.invalidError())
      }

      return res.status(200).json({
        success: true,
        data: response[0],
      })
    } catch (error) {
      return next(CustomErrorHandler.serverError())
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    const { error } = settingSchema.validate(req.body)

    if (error) {
      return next(error)
    }
    const setting = req.body
    const { name, logo, contactNo, address } = setting.store
    const id = req.params.id

    try {
      const settings = await Setting.find()

      const data = {
        store: {
          name: name,
          logo: logo,
          contactNo: contactNo,
          address: address,
        },
        currency: setting.currency,
      }

      let response
      if (settings.length === 0) {
        response = await Setting.create(data)
      } else {
        response = await Setting.findByIdAndUpdate(id, data, { new: true })
      }

      if (!response) {
        return next(CustomErrorHandler.invalidError())
      }

      return res.status(200).json({
        success: true,
        message: `Settings update successfully`,
        data: response,
      })
    } catch (error) {
      return next(error)
    }
  },
}

export default settingsController
