import { Request, Response, NextFunction } from 'express'
import { ICurrenUser } from '../interface/userInterface'
import CustomErrorHandler from '../services/CustomErrorHandler'
import JwtService from '../services/JwtService'

const auth = async (req: Request, res: Response, next: NextFunction) => {
  let authHeader = req.headers.authorization

  if (!authHeader) {
    return next(CustomErrorHandler.unAuthorized())
  }

  const token = authHeader!.split(' ')[1]

  try {
    const { _id, isAdmin } = await JwtService.verify(token)

    const user: ICurrenUser = {
      _id,
      isAdmin,
    }

    req.user = user

    next()
  } catch (error) {
    return next(CustomErrorHandler.unAuthorized())
  }
}

export default auth
