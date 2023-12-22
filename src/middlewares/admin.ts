import { Request, Response, NextFunction } from 'express'
import { IUser } from '../interface/userInterface'
import User from '../models/User'
import CustomErrorHandler from '../services/CustomErrorHandler'
const admin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: IUser | null = await User.findOne({ _id: req.user._id })
    if (user != null && user.isAdmin) {
      next()
    } else {
      return next(CustomErrorHandler.unAuthorized())
    }
  } catch (error) {
    return next(CustomErrorHandler.serverError())
  }
}

export default admin
