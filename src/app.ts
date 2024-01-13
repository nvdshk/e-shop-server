import express, { Application } from 'express'
import { Server } from 'http'
import { APP_PORT, BASE_URL, DB_URL } from './config'
import errorHandler from './middlewares/errorHandler'
import userRouter from './routes/userRouter'
import { connect, connection } from 'mongoose'
import cors from 'cors'
import categoryRouter from './routes/categoryRouter'
import fileRouter from './routes/fileRouter'
import fileUpload from 'express-fileupload'
import productRouter from './routes/productRouter'
import cartRouter from './routes/cartRouter'
import orderRouter from './routes/orderRouter'
import addressRouter from './routes/addressRouter'
import initializeFirebaseSDK from './startup/firebaseConfig'
import deviceRouter from './routes/deviceRouter'
import notificationRouter from './routes/notificationRouter'
import paymentRouter from './routes/paymentRouter'
import settingRouter from './routes/settingRouter'

initializeFirebaseSDK()

connect(DB_URL as string)
const db = connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
  console.log('DB connected...')
})

const app: Application = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(
  fileUpload({
    useTempFiles: true,
    limits: {
      fileSize: 1024 * 1024, // 1 MB
    },
    abortOnLimit: true,
  })
)
// app.use(cors())
// cors => cross orgin resource sharing
app.use(cors({ origin: [BASE_URL as string], credentials: true }))

app.use('/api', fileRouter)
app.use('/api', userRouter)
app.use('/api', categoryRouter)
app.use('/api', productRouter)
app.use('/api', cartRouter)
app.use('/api', orderRouter)
app.use('/api', addressRouter)
app.use('/api', deviceRouter)
app.use('/api', notificationRouter)
app.use('/api', paymentRouter)
app.use('/api', settingRouter)
app.use(errorHandler)

const port = process.env.PORT || Number(APP_PORT)

const server: Server = app.listen(port, () =>
  console.log(`Listening... on port ${port}`)
)
