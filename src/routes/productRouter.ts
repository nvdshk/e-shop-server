import express from 'express'
import productController from '../controllers/productController'
import auth from '../middlewares/auth'

const productRouter = express.Router()

productRouter.get('/products/', productController.findAll)
productRouter.get('/products/:id', productController.findOne)
productRouter.post('/products', auth, productController.create)
productRouter.put('/products/:id', auth, productController.update)
productRouter.delete('/products/:id', auth, productController.delete)

export default productRouter
