import { Request, Response, NextFunction } from 'express'
import { ICart } from '../interface/cartInterface'
import Address from '../models/address'
import Cart from '../models/Cart'
import Order from '../models/Order'
import Product from '../models/Product'
import sendPushNotification from '../services/fcmService'
import Device from '../models/device'
import { IDevice } from '../interface/deviceInterface'

const orderController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id
      const { paymentType } = req.body

      const address = await Address.findOne(
        {
          user: userId,
          'address.isPrimary': true,
        },
        { 'address.$': 1 }
      )

      const shippingAddress = address?.address[0]

      if (!shippingAddress) {
        return res.status(400).json({ message: 'Shipping Address not found' })
      }

      if (paymentType != 'cod') {
        return res.status(400).json({ message: 'Payment method not found' })
      }

      const userCart: ICart | null = await Cart.findOne({ userId: userId })

      if (!userCart || userCart.items.length <= 0) {
        return res.status(400).json({ message: 'Cart is empty' })
      }

      let totalAmount = 0

      userCart.items.forEach((item) => {
        totalAmount += item.total
      })

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
        paymentType: paymentType,
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

      res.status(201).json({ success: true })

      // Send Push Notification
      const device: IDevice | null = await Device.findOne({ user: userId })
      const fcmToken = device?.token ?? ''
      const title = 'E-Shop'
      const body =
        'Your has been successfuly placed. Thank you purchasing from E-Shop'

      sendPushNotification(fcmToken, userId, title, body)
    } catch (error) {
      return next(error)
    }
  },

  async findAllMyOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await Order.find({ user: req.user._id }).populate({
        path: 'items',
        populate: {
          path: 'product',
          select: '_id name image color price size',
        },
      })
      res.status(200).json({ success: true, data: response })
    } catch (error) {
      next(error)
    }
  },

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await Order.findOne({ _id: req.params.id }).populate({
        path: 'items',
        populate: {
          path: 'product',
          select: '_id name image color price size',
        },
      })
      res.status(200).json({ success: true, data: response })
    } catch (error) {
      next(error)
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await Order.findByIdAndRemove(req.params._id)
      res.json({ success: true })
    } catch (error) {
      next(error)
    }
  },

  async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    const orderId = req.params.id
    const orderStatusId = req.params.statusId

    try {
      const response = await Order.findOneAndUpdate(
        { _id: orderId, 'orderStatus._id': orderStatusId },
        {
          $set: {
            'orderStatus.$.date': new Date(),
            'orderStatus.$.isCompleted': true,
          },
        }
      )

      return res.status(200).json({ success: true })
    } catch (error) {
      return next(error)
    }
  },
}

export default orderController
