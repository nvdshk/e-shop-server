import { ICart } from '../interface/cartInterface'
import { IDevice } from '../interface/deviceInterface'
import Cart from '../models/Cart'
import Order from '../models/Order'
import Payment from '../models/Payment'
import Product from '../models/Product'
import Setting from '../models/Setting'
import Address from '../models/address'
import Device from '../models/device'
import CustomErrorHandler from '../services/CustomErrorHandler'
import sendPushNotification from '../services/fcmService'
import mongoose from 'mongoose'
import { NextFunction } from 'express'
import { ISetting } from '../interface/settingInteface'

const utils = {
  async createOrder(
    userId: string,
    paymentStatus: string,
    paymentType: string,
    payment: mongoose.Types.ObjectId,
    orderId?: string
  ) {
    try {
      const address = await Address.findOne(
        {
          user: userId,
          'address.isPrimary': true,
        },
        { 'address.$': 1 }
      )

      const shippingAddress = address?.address[0]

      if (!shippingAddress) {
        return //Shipping Address not found
      }

      const userCart = await utils.getCartItems(userId)

      if (!userCart || userCart.items.length <= 0) {
        return // Cart is Empty
      }

      const totalAmount = utils.getOrderAmount(userCart)

      const oderStatus = [
        {
          type: 'ordered',
          date: new Date(),
          isCompleted: true,
        },
        {
          type: 'packed',
          isCompleted: false,
        },
        {
          type: 'shipped',
          isCompleted: false,
        },
        {
          type: 'delivered',
          isCompleted: false,
        },
      ]
      const order = new Order({
        user: userId,
        address: shippingAddress,
        items: userCart.items,
        totalAmount: totalAmount,
        paymentStatus: paymentStatus,
        paymentType: paymentType,
        payment: payment,
        orderStatus: oderStatus,
      })
      const response = await order.save()

      let update = userCart.items.map((item) => {
        return {
          updateOne: {
            filter: { product: item.product },
            update: { $inc: { stock: -item.quantity } },
          },
        }
      })

      const updated = await Product.bulkWrite(update, {})
      const cart = await Cart.findOneAndDelete({ _id: userCart._id })

      // Send Push Notification
      const device: IDevice | null = await Device.findOne({ user: userId })
      const fcmToken = device?.token ?? ''
      const title = 'Ordered'
      const body =
        'Your order has been placed successfuly. Thank you purchasing from E-Shop'

      sendPushNotification(fcmToken, userId, title, body)
    } catch (error) {
      return console.log('Error')
    }
  },

  async createPayment(
    userId: string,
    orderId: string,
    paymentId: string,
    signature: string,
    currency: string,
    status: string
  ) {
    const userCart = await utils.getCartItems(userId)
    const amount = utils.getOrderAmount(userCart!)

    const payment = new Payment({
      orderId: orderId,
      paymentId: paymentId,
      signature: signature,
      amount: amount,
      currency: currency,
      status: status,
    })
    return await payment.save()
  },

  getOrderAmount(cart: ICart, includeTax?: boolean): number {
    let totalAmount = 0

    cart.items.forEach((item) => {
      if (includeTax) {
        totalAmount += item.taxIncludeTotal
      } else {
        totalAmount += item.total
      }
    })

    return totalAmount
  },

  async getCartItems(userId: string): Promise<ICart | null> {
    const userCart: ICart | null = await Cart.findOne({ userId: userId })
    return userCart
  },

  async checkIsStoreSettingsExist(
    settings: Array<ISetting>,
    next: NextFunction
  ) {
    if (!settings) {
      return next(CustomErrorHandler.invalidError())
    }
    if (settings.length === 0) {
      return next(
        CustomErrorHandler.invalidError('Please setup the store first')
      )
    }
  },

  calculateTaxAmount(taxRate: number, taxExcludeAmount: number): number {
    return (taxExcludeAmount * taxRate) / 100
  },
}

export default utils
