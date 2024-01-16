import express from 'express'
import productController from '../controllers/productController'
import auth from '../middlewares/auth'
import admin from '../middlewares/admin'

const productRouter = express.Router()

productRouter.get('/products/', productController.findAll)
productRouter.get('/products/:id', productController.findOne)
productRouter.post('/products', [auth, admin], productController.create)
productRouter.put('/products/:id', [auth, admin], productController.update)
productRouter.delete('/products/:id', [auth, admin], productController.delete)

export default productRouter
