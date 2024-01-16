import mongoose, { Schema, model, Model } from 'mongoose'
import { IOrder } from '../interface/orderInterface'

const orderSchema = new mongoose.Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    address: {
      name: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: Number,
        required: true,
      },
      pincode: {
        type: Number,
        required: true,
      },
      locality: {
        type: String,
        required: true,
      },
      houseAddress: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      addressType: {
        type: String,
        required: true,
      },
      landmark: {
        type: String,
      },
      alternateNumber: {
        type: String,
      },
    },
    items: [
      {
        // name: {
        //   type: String,
        //   required: true,
        // },
        // image: {
        //   type: String,
        //   required: true,
        // },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    taxIncludeTotalAmount: {
      type: Number,
      required: true,
    },
    paymentType: {
      type: String,
      enum: ['cod', 'card', 'razorpay', 'stripe'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    payment: mongoose.Schema.Types.ObjectId,

    orderStatus: [
      {
        type: {
          type: String,
          enum: ['ordered', 'packed', 'shipped', 'delivered'],
          default: 'ordered',
        },
        date: {
          type: Date,
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
)

const Order: Model<IOrder> = mongoose.model('Order', orderSchema)

export default Order
