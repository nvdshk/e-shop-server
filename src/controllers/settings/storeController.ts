import { Request, Response, NextFunction, response } from 'express'
import CustomErrorHandler from '../../services/CustomErrorHandler'
import Setting from '../../models/Setting'
import storeSchema from '../../validators/settingValidator'
import { ISetting } from '../../interface/settingInteface'

const settingsStoreController = {
  async find(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await Setting.find().select('-updatedAt -__v')

      if (!response) {
        return next(CustomErrorHandler.invalidError())
      }

      return res.status(200).json({
        success: true,
        data: response[0].store,
      })
    } catch (error) {
      return next(CustomErrorHandler.serverError())
    }
  },

  async updateStore(req: Request, res: Response, next: NextFunction) {
    const { error } = storeSchema.validate(req.body)

    if (error) {
      return next(error)
    }

    const { name, logo, contactNo, address } = req.body
    const data = {
      store: {
        name: name,
        logo: logo,
        contactNo: contactNo,
        address: address,
      },
    }

    try {
      const settings: Array<ISetting> = await Setting.find()

      let response
      if (settings[0]?.store._id === null) {
        response = await Setting.create(data)
      } else {
        const id = settings[0]._id
        const ssId = req.params.id

        response = await Setting.findOneAndUpdate(
          {
            _id: id,
            'store._id': ssId,
          },

          {
            $set: data,
          },
          {
            new: true,
          }
        )
      }

      if (!response) {
        return next(CustomErrorHandler.invalidError())
      }

      return res.status(200).json({
        success: true,
        message: `Store Settings saved successfully`,
        data: response.store,
      })
    } catch (error) {
      return next(error)
    }
  },
}

export default settingsStoreController
