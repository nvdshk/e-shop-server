import { Request, Response, NextFunction } from 'express'
import User from '../../models/User'
import CustomErrorHandler from '../../services/CustomErrorHandler'

const userController = {
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findOne({ _id: req.user._id }).select(
        '-password -updateAt -__v'
      )

      if (!user) {
        return next(CustomErrorHandler.notFound())
      }

      res.json({ data: user })
    } catch (error) {
      next(error)
    }
  },
}

export default userController
