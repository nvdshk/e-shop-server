import dotenv from 'dotenv'
dotenv.config()

export const {
  APP_PORT,
  DEBUG_MODE,
  DB_URL,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  JWT_SECRET,
  REFRESH_SECRET,
  FIREBASE_PRIVATE_KEY,
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
} = process.env
