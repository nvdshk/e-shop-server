import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { REFRESH_SECRET } from '../../config'
import { IUser } from '../../interface/userInterface'
import RefreshToken from '../../models/RefreshToken'
import User from '../../models/User'
import CustomErrorHandler from '../../services/CustomErrorHandler'
import JwtService from '../../services/JwtService'

const refreshController = {
  async refresh(req: Request, res: Response, next: NextFunction) {
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    })

    const { error } = refreshSchema.validate(req.body)

    if (error) {
      next(error)
    }

    try {
      let refreshToken = await RefreshToken.findOne({
        token: req.body.refresh_token,
      })

      if (!refreshToken) {
        return next(CustomErrorHandler.unAuthorized('Invalid refresh token'))
      }

      let userId

      try {
        const { _id } = await JwtService.verify(
          refreshToken.token,
          REFRESH_SECRET
        )
        userId = _id
      } catch (error) {
        return next(CustomErrorHandler.unAuthorized('Invalid refresh token'))
      }

      const user: IUser | null = await User.findOne({ _id: userId })

      if (!user) {
        return next(CustomErrorHandler.notFound('No user found!'))
      }

      const accessToken = JwtService.sign({
        _id: user._id,
        isAdmin: user.isAdmin,
      })
      const refToken = JwtService.sign(
        {
          _id: user._id,
          isAdmin: user.isAdmin,
        },
        '1y',
        REFRESH_SECRET
      )

      await RefreshToken.create({ token: refToken })

      res.json({
        access_token: accessToken,
        refresh_token: refToken,
      })
    } catch (error) {
      next(error)
    }
  },
}

export default refreshController
