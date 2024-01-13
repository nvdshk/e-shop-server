import express from 'express'
import admin from '../middlewares/admin'
import auth from '../middlewares/auth'
import settingsController from '../controllers/settingController'

const settingRouter = express.Router()

settingRouter.get('/settings', [auth, admin], settingsController.find)
settingRouter.put('/settings/:id', [auth, admin], settingsController.update)

export default settingRouter
