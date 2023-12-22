import express from 'express'
import auth from '../middlewares/auth'
import fileController from '../controllers/fileController'

const fileRouter = express.Router()

fileRouter.post('/files', auth, fileController.uploadFile)

export default fileRouter
