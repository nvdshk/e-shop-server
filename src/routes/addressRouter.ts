import express from 'express'
import addressController from '../controllers/addressContoller'
import auth from '../middlewares/auth'

const addressRouter = express.Router()

addressRouter.get(
  '/addresses/primary',
  auth,
  addressController.findPrimaryAddress
)
addressRouter.patch(
  '/addresses/primary',
  auth,
  addressController.updatePrimaryAddress
)
addressRouter.get('/addresses', auth, addressController.findAll)
addressRouter.get('/addresses/:id', auth, addressController.findOne)
addressRouter.post('/addresses', auth, addressController.create)
addressRouter.delete('/addresses/:id', auth, addressController.delete)

export default addressRouter
