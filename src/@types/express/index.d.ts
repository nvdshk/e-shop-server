import { ICurrenUser } from '../../interface/userInterface'

declare global {
  namespace Express {
    interface Request {
      user: ICurrenUser
    }
  }
}
