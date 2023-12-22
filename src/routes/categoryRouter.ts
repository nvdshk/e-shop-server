import express from 'express'
import categoryController from '../controllers/categoryController'
import admin from '../middlewares/admin'
import auth from '../middlewares/auth'

const categoryRouter = express.Router()

categoryRouter.get('/categories/', categoryController.findAll)
categoryRouter.get('/categories/:id', categoryController.findOne)
categoryRouter.post('/categories/', [auth, admin], categoryController.create)
categoryRouter.put('/categories/:id', [auth, admin], categoryController.update)
categoryRouter.delete(
  '/categories/:id',
  [auth, admin],
  categoryController.delete
)

export default categoryRouter
