import { Request, Response, NextFunction } from 'express'
import Notification from '../models/notification'
import Device from '../models/device'
import { IDevice } from '../interface/deviceInterface'
import { sendToAllPushNotification } from '../services/fcmService'

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

  async findAllByAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await Notification.find({}).select(
        'message.notification.title message.notification.body message.notification.image sent date'
      )

      return res.status(200).json({ success: true, data: response })
    } catch (error) {
      return next(error)
    }
  },
  async sendToAllNotifcation(req: Request, res: Response, next: NextFunction) {
    const { title, body, image } = req.body

    try {
      const devices = await Device.find()

      let fcmTokens = []
      if (devices.length !== 0) {
        for (let i = 0; i < devices.length; i++) {
          fcmTokens.push(devices[i].token)
        }
      }

      sendToAllPushNotification(fcmTokens, title, body, image)

      return res.status(200).json({ success: true, message: 'Success' })
    } catch (error) {
      return next(error)
    }
  },
}

export default notificationController
