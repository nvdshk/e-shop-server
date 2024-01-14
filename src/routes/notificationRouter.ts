import express from 'express'
import notificationController from '../controllers/notificationController'
import auth from '../middlewares/auth'
import admin from '../middlewares/admin'

const notificationRouter = express.Router()

notificationRouter.get('/notifications', auth, notificationController.findAll)

notificationRouter.get(
  '/notifications/all',
  [auth, admin],
  notificationController.findAllByAdmin
)

notificationRouter.post(
  '/notifications/send-to-all',
  [auth, admin],
  notificationController.sendToAllNotifcation
)

// notificationRouter.post(
//     '/notifications/topic/:topic',
//     [auth, admin],
//     notificationController.sendTopicNotifcation
//   )

export default notificationRouter
