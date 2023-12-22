import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import User from '../../models/User'
import bcrypt from 'bcrypt'
import CustomErrorHandler from '../../services/CustomErrorHandler'
import JwtService from '../../services/JwtService'
import { REFRESH_SECRET } from '../../config'
import RefreshToken from '../../models/RefreshToken'

const loginController = {
  async login(req: Request, res: Response, next: NextFunction) {
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
    })

    const { error } = loginSchema.validate(req.body)
    if (error) {
      return next(error)
    }

    try {
      const user = await User.findOne({ email: req.body.email })

      if (!user) {
        return next(CustomErrorHandler.invalidCredentials())
      }

      const match = await bcrypt.compare(req.body.password, user.password)

      if (!match) {
        return next(CustomErrorHandler.invalidCredentials())
      }

      const accessToken = JwtService.sign({
        _id: user._id,
        isAdmin: user.isAdmin,
      })

      const refreshToken = JwtService.sign(
        {
          _id: user._id,
          isAdmin: user.isAdmin,
        },
        '1y',
        REFRESH_SECRET
      )

      await RefreshToken.create({ token: refreshToken })

      res.json({
        access_token: accessToken,
        refresh_token: refreshToken,
      })
    } catch (error: any) {
      return next(new Error(`Someting went wrong  ${error.message}`))
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    })

    const { error } = refreshSchema.validate(req.body)

    if (error) {
      return next(error)
    }

    try {
      await RefreshToken.deleteOne({ token: req.body.refresh_token })
    } catch (error) {
      return next(new Error('Some went wrong in database'))
    }

    res.json({ status: 1 })
  },
}
export default loginController
