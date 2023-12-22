import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import User from '../../models/User'
import JwtService from '../../services/JwtService'
import Joi from 'joi'
import CustomErrorHandler from '../../services/CustomErrorHandler'
import { REFRESH_SECRET } from '../../config'
import RefreshToken from '../../models/RefreshToken'

const registerController = {
  async register(req: Request, res: Response, next: NextFunction) {
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
    })

    const { error } = registerSchema.validate(req.body)
    if (error) {
      return next(error)
    }

    try {
      const exist = await User.exists({ email: req.body.email })
      console.log(exist)
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist('This email is already taken.')
        )
      }
    } catch (error) {
      return next(error)
    }

    const { name, email, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
    })

    try {
      const result = await user.save()

      const accessToken = JwtService.sign({
        _id: result._id,
        isAdmin: result.isAdmin,
      })

      const refreshToken = JwtService.sign(
        {
          _id: result._id,
          isAdmin: result.isAdmin,
        },
        '1y',
        REFRESH_SECRET
      )

      await RefreshToken.create({ token: refreshToken })

      return res.json({
        access_token: accessToken,
        refresh_token: refreshToken,
      })
    } catch (error) {
      next(error)
    }
  },
}

export default registerController
