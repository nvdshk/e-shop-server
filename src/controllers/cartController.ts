import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import { IItem } from '../interface/cartInterface'
import Cart from '../models/Cart'
import Product from '../models/Product'
import CustomErrorHandler from '../services/CustomErrorHandler'

const cartController = {
  async findAll(req: Request, res: Response, next: NextFunction) {
    const userId = req.user._id
    try {
      const response = await Cart.findOne({ user: userId })
        .select('_id userId')
        .populate({
          path: 'items',
          populate: {
            path: 'product',
            select: '-createdAt -updatedAt -__v',
          },
        })

      res.status(200).json({
        success: true,
        data: response,
      })
    } catch (error) {
      next(error)
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    const userId = req.user._id
    const productId = req.body.productId
    const quantity = Number.parseInt(req.body.quantity)

    try {
      let cart = await Cart.findOne({ userId: userId })
      const product = await Product.findById({ _id: productId })

      if (!product) {
        return next(CustomErrorHandler.notFound())
      }
      //--If Cart Exists ----
      if (cart) {
        //---- Check if index exists ----
        const indexFound = cart.items.findIndex(
          (item) => item.product == productId
        )

        //----------Check if product exist, just add the previous quantity with the new quantity and update the total price-------
        if (indexFound !== -1) {
          cart.items[indexFound].quantity =
            cart.items[indexFound].quantity + quantity
          cart.items[indexFound].total =
            cart.items[indexFound].quantity * product.price
          cart.items[indexFound].price = product.price
        }
        //----Check if quantity is greater than 0 then add item to items array ----
        else if (quantity > 0) {
          cart.items.push({
            product: productId,
            quantity: quantity,
            price: product.price,
            total: product.price * quantity,
          } as IItem)
        }
        //----If quantity of price is 0 throw the error -------
        else {
          return res.status(400).json({
            message: 'Invalid request',
          })
        }
        const response = await cart.save()
        const populatedCart = await response.populate({
          path: 'items',
          populate: {
            path: 'product',
            select: '-createdAt -updatedAt -__v',
          },
        })

        res.status(200).json({
          success: true,
          data: populatedCart,
        })
      } else {
        //------------ This creates a new cart and then adds the item to the cart that has been created------------
        const response = await Cart.create({
          userId: userId,
          items: [
            {
              product: productId,
              quantity: quantity,
              price: product.price,
              total: product.price * quantity,
            },
          ],
        })

        const populatedCart = await response.populate({
          path: 'items',
          populate: {
            path: 'product',
            select: '-createdAt -updatedAt -__v',
          },
        })

        return res.status(201).json({ success: true, data: populatedCart })
      }
    } catch (error) {
      return next(error)
    }
  },

  async updateCartItemQty(req: Request, res: Response, next: NextFunction) {
    const userId = req.user._id
    const productId = req.body.productId
    const quantity = Number.parseInt(req.body.quantity)
    const isIncrement = Math.sign(quantity)

    try {
      let cart = await Cart.findOne({ userId: userId })
      const product = await Product.findById({ _id: productId })

      if (!product) {
        return next(CustomErrorHandler.notFound())
      }

      if (!cart) {
        return next(CustomErrorHandler.notFound())
      }
      const indexFound = cart.items.findIndex(
        (item) => item.product == productId
      )

      const oldCartItemQty = cart.items[indexFound].quantity

      if (indexFound === -1) {
        return next(CustomErrorHandler.notFound('No product in cart with id'))
      } else if (
        isIncrement === -1 &&
        oldCartItemQty - Math.abs(quantity) < 1
      ) {
        return res.status(400).json({
          message: 'Invalid request',
        })
      }

      const response = Cart.findOneAndUpdate(
        {
          userId: userId,
          'items.product': productId,
        },
        {
          $inc: {
            'items.$.quantity': quantity,
            'items.$.total': isIncrement
              ? product.price * quantity
              : -(product.price * quantity),
          },
        },
        {
          select: {
            items: {
              $elemMatch: { product: productId },
            },
          },
          new: true,
        }
      )

      const populatedCart = await response.populate({
        path: 'items',
        populate: {
          path: 'product',
          select: '-createdAt -updatedAt -__v',
        },
      })
      return res.status(200).json({
        success: true,
        data: populatedCart,
      })
    } catch (error) {
      return next(error)
    }
  },

  async deleteCartItems(req: Request, res: Response, next: NextFunction) {
    const cartId = req.params.id
    const productId = req.params.productId

    try {
      const response = await Cart.findByIdAndUpdate(
        { _id: cartId },
        {
          $pull: {
            items: {
              product: productId,
            },
          },
        }
      )
      return res.status(202).json({ success: true })
    } catch (error) {
      return next(error)
    }
  },
}

export default cartController
