import express from 'express'
import admin from '../middlewares/admin'
import auth from '../middlewares/auth'
import settingsStoreController from '../controllers/settings/storeController'
import settingsCurrencyController from '../controllers/settings/currencyController'

const settingRouter = express.Router()

settingRouter.get(
  '/store-settings',
  [auth, admin],
  settingsStoreController.find
)

settingRouter.put(
  '/store-settings/:id',
  [auth, admin],
  settingsStoreController.updateStore
)

settingRouter.get(
  '/currency-settings',
  [auth, admin],
  settingsCurrencyController.findAll
)
settingRouter.post(
  '/currency-settings',
  [auth, admin],
  settingsCurrencyController.create
)
settingRouter.put(
  '/currency-settings/:id',
  [auth, admin],
  settingsCurrencyController.update
)
settingRouter.delete(
  '/currency-settings/:id',
  [auth, admin],
  settingsCurrencyController.delete
)

export default settingRouter
