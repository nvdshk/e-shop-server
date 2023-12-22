class CustomErrorHandler extends Error {
  private statusCode: number
  private msg: string

  constructor(statusCode: number, msg: string) {
    super()
    this.statusCode = statusCode
    this.msg = msg
  }

  getStatusCode() {
    return this.statusCode
  }

  getMessage() {
    return this.msg
  }

  static alreadyExist(msg: string): CustomErrorHandler {
    return new CustomErrorHandler(409, msg)
  }

  static invalidCredentials(msg = 'invalid credentials'): CustomErrorHandler {
    return new CustomErrorHandler(401, msg)
  }

  static unAuthorized(msg = 'unAuthorized'): CustomErrorHandler {
    return new CustomErrorHandler(401, msg)
  }

  static notFound(msg = '404 Not Fount'): CustomErrorHandler {
    return new CustomErrorHandler(404, msg)
  }

  static serverError(msg = 'Internal server error'): CustomErrorHandler {
    return new CustomErrorHandler(500, msg)
  }

  static noFileUploaded(msg = 'No files were uploaded'): CustomErrorHandler {
    return new CustomErrorHandler(400, msg)
  }

  static invalidImage(msg = 'Invalid Image'): CustomErrorHandler {
    return new CustomErrorHandler(422, msg)
  }

  static paymentError(msg: string): CustomErrorHandler {
    return new CustomErrorHandler(400, msg)
  }

  static fieldNoFound(
    msg = 'Fields required cannot be empty'
  ): CustomErrorHandler {
    return new CustomErrorHandler(400, msg)
  }

  static invalidError(msg = 'Invalid'): CustomErrorHandler {
    return new CustomErrorHandler(400, msg)
  }
}

export default CustomErrorHandler
