import express from 'express'
import notificationController from '../controllers/notificationController'
import auth from '../middlewares/auth'

const notificationRouter = express.Router()

notificationRouter.get('/notifications', auth, notificationController.findAll)

export default notificationRouter
