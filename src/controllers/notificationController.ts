import { Request, Response, NextFunction } from 'express'
import Notification from '../models/notification'

const notificationController = {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await Notification.find({
        user: req.user._id,
      }).select('message.notification.title message.notification.body date')

      return res.status(200).json({ success: true, data: response })
    } catch (error) {
      return next(error)
    }
  },
}

export default notificationController
