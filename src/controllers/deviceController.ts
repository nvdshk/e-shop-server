import { Request, Response, NextFunction } from 'express'
import Device from '../models/device'

const deviceController = {
  async save(req: Request, res: Response, next: NextFunction) {
    const userId = req.user._id
    const platform = 'android'
    const token = req.body.token as string

    try {
      if (!token) return res.status(403).json({ message: 'Token is required' })

      const device = await Device.findOne({ token: token })
      if (device?.token)
        return res.status(400).json({ message: 'Token already exists' })

      const response = await Device.create({
        user: userId,
        token: token,
        platform: platform,
      })

      const deviceInfo = response.toObject()
      delete deviceInfo.__v

      res.status(200).json({ success: true, data: deviceInfo })
    } catch (error) {
      return next(error)
    }
  },
  async delete(req: Request, res: Response, next: NextFunction) {
    const deviceId = req.params.id
    try {
      await Device.findByIdAndRemove(deviceId)
      res.json({ success: true })
    } catch (error) {
      next(error)
    }
  },
}

export default deviceController
