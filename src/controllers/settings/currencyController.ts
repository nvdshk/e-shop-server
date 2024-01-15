import { Request, Response, NextFunction, response } from 'express'
import Setting from '../../models/Setting'
import CustomErrorHandler from '../../services/CustomErrorHandler'
import utils from '../../utils/utils '
import { ISetting } from '../../interface/settingInteface'
import { currencySchema } from '../../validators/settingValidator'

const settingsCurrencyController = {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await Setting.find().select('-updatedAt -__v')

      if (!response) {
        return next(CustomErrorHandler.invalidError())
      }

      return res.status(200).json({
        success: true,
        data: response[0].currency,
      })
    } catch (error) {
      return next(CustomErrorHandler.serverError())
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    const { error } = currencySchema.validate(req.body)

    if (error) {
      return next(error)
    }

    const settings: Array<ISetting> = await Setting.find()
    await utils.checkIsStoreSettingsExist(settings, next)

    const { name, symbol, code, exchangeRate } = req.body
    const id = settings[0]._id

    try {
      const response = await Setting.findOneAndUpdate(
        {
          _id: id,
        },

        {
          $push: {
            currency: {
              name: name,
              symbol: symbol,
              code: code,
              exchangeRate: exchangeRate,
            },
          },
        },
        {
          new: true,
        }
      )

      if (!response) {
        return next(CustomErrorHandler.invalidError())
      }

      return res.status(200).json({
        success: true,
        message: `Currency created successfully`,
        data: response.currency,
      })
    } catch (error) {
      return next(error)
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    const { error } = currencySchema.validate(req.body)

    if (error) {
      return next(error)
    }
    const settings = await Setting.find()
    await utils.checkIsStoreSettingsExist(settings, next)

    const { name, symbol, code, exchangeRate } = req.body

    const id = settings[0]._id
    const currenyId = req.params.id

    try {
      const response = await Setting.findOneAndUpdate(
        {
          _id: id,
          'currency._id': currenyId,
        },

        {
          $set: {
            'currency.$.name': name,
            'currency.$.symbol': symbol,
            'currency.$.code': code,
            'currency.$.exchangeRate': exchangeRate,
          },
        },
        {
          new: true,
        }
      )

      if (!response) {
        return next(CustomErrorHandler.invalidError())
      }

      return res.status(200).json({
        success: true,
        message: `Currency update successfully`,
        data: response,
      })
    } catch (error) {
      return next(error)
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    const settings = await Setting.find()
    if (!settings) {
      return next(CustomErrorHandler.invalidError())
    }

    const id = settings[0]._id
    const currencyId = req.params.id

    try {
      const response = await Setting.findOneAndUpdate(
        { _id: id },
        {
          $pull: {
            currency: {
              _id: currencyId,
            },
          },
        }
      )
      return res.status(202).json({ success: true })
    } catch (error) {
      return next(error)
    }
  },
}

export default settingsCurrencyController
