import express from 'express'
import paymentController from '../controllers/paymentController'
import auth from '../middlewares/auth'

const paymentRouter = express.Router()

// Razorpay
paymentRouter.get('/razorpay/order', auth, paymentController.order)
paymentRouter.post('/razorpay/verify', auth, paymentController.verify)

// Stripe

// Braintree

// PayPal

export default paymentRouter
