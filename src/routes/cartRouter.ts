import express from 'express'
import cartController from '../controllers/cartController'
import auth from '../middlewares/auth'
const cartRouter = express.Router()

cartRouter.get('/carts', auth, cartController.findAll)
cartRouter.post('/carts', auth, cartController.create)
cartRouter.patch('/carts/update-qty', auth, cartController.updateCartItemQty)
cartRouter.delete(
  '/carts/:id/products/:productId',
  auth,
  cartController.deleteCartItems
)

export default cartRouter
