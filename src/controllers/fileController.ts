import express, { Request, Response, NextFunction } from 'express'
import { v2 as cloudinary } from 'cloudinary'
import CustomErrorHandler from '../services/CustomErrorHandler'
import path from 'path'
import { UploadedFile } from 'express-fileupload'

import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from '../config'

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
})

const fileController = {
  async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.files) {
        return next(CustomErrorHandler.noFileUploaded())
      }
      const file = req.files.file as UploadedFile
      const extensionName = path.extname(file.name) // fetch the file extension
      const allowedExtension = ['.png', '.jpg', '.jpeg']

      if (!allowedExtension.includes(extensionName)) {
        return next(CustomErrorHandler.invalidImage())
      }

      const response = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'imgs',
      })
      return res.status(200).json({
        success: true,
        url: response.secure_url,
      })
    } catch (error) {
      console.log(error)
      return next(CustomErrorHandler.serverError())
    }
  },
}
export default fileController
