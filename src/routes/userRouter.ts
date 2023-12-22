import express from 'express'
import registerController from '../controllers/auth/registerController'
import loginController from '../controllers/auth/loginControlller'
import userController from '../controllers/auth/userController'
import auth from '../middlewares/auth'
import refreshController from '../controllers/auth/refreshController'
const userRouter = express.Router()

userRouter.post('/register', registerController.register)
userRouter.post('/login', loginController.login)
userRouter.get('/me', auth, userController.me)
userRouter.post('/refresh', refreshController.refresh)
userRouter.post('/logout', auth, loginController.logout)

export default userRouter
