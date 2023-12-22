import express from 'express'
import deviceController from '../controllers/deviceController'
import auth from '../middlewares/auth'

const deviceRouter = express.Router()

deviceRouter.post('/devices', auth, deviceController.save)
deviceRouter.delete('/devices', auth, deviceController.delete)

export default deviceRouter
