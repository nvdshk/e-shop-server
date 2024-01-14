import express from 'express'
import orderController from '../controllers/orderController'
import admin from '../middlewares/admin'
import auth from '../middlewares/auth'

const orderRouter = express.Router()

orderRouter.post('/orders', auth, orderController.create)
orderRouter.get('/orders/me', auth, orderController.findAllMyOrders)
orderRouter.get('/orders/:id', auth, orderController.findOne)
orderRouter.delete('/orders/:id', [auth, admin], orderController.delete)

orderRouter.put(
  '/orders/:id/status/:statusId',
  [auth, admin],
  orderController.updateOrderStatus
)
orderRouter.get('/orders', [auth, admin], orderController.findAll)

export default orderRouter
