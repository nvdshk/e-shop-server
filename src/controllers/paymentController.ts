import { Request, Response, NextFunction } from 'express'
import { nanoid } from 'nanoid'
import RazorPay from 'razorpay'
import crypto from 'crypto'
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from '../config'
import CustomErrorHandler from '../services/CustomErrorHandler'
import createOrder from '../utils/utils '
import Payment from '../models/Payment'
import order from '../utils/utils '
import utils from '../utils/utils '

const paymentController = {
  async order(req: Request, res: Response, next: NextFunction) {
    const userId = req.user._id

    try {
      const userCart = await utils.getCartItems(userId)
      const amount = utils.getOrderAmount(userCart!, true)
      if (!amount || amount <= 0) {
        return next(CustomErrorHandler.invalidError('Invalid amount'))
      }

      const orderAmount = amount
      const curreny = 'INR'
      const orderReceipt = nanoid()

      var instance = new RazorPay({
        key_id: RAZORPAY_KEY_ID!,
        key_secret: RAZORPAY_KEY_SECRET,
      })

      var options = {
        amount: orderAmount * 100,
        currency: curreny,
        receipt: orderReceipt,
      }

      const orders = await instance.orders.create(options)

      return res.status(200).json({
        success: true,
        data: {
          orderId: orders.id,
          orderAmount: orders.amount,
          curreny: curreny,
          razorpayKey: RAZORPAY_KEY_ID,
        },
      })
    } catch (error) {
      console.log(`error ${error}`)
      next(CustomErrorHandler.paymentError('not able to establish order'))
    }
  },

  async verify(req: Request, res: Response, next: NextFunction) {
    const userId = req.user._id

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body

    try {
      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return next(CustomErrorHandler.fieldNoFound())
      }

      //save data after verifying payment
      let body = razorpay_order_id + '|' + razorpay_payment_id

      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest('hex')

      let isPaymentVerified =
        expectedSignature === razorpay_signature ? true : false

      if (!isPaymentVerified) {
        return res.status(400).json({
          success: false,
          message:
            'Payment not verified...try again. money deducted will be returned to your account within 3 to 5 days',
        })
      }

      //since verified payment, saving it to orderCollection

      const payment = await utils.createPayment(
        userId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        'INR',
        'completed'
      )
      await utils.createOrder(userId, 'completed', 'razorpay', payment._id)

      res.status(200).json({ success: true, message: 'Payment successful' })
    } catch (error) {
      next(CustomErrorHandler.serverError())
    }
  },
}

export default paymentController
