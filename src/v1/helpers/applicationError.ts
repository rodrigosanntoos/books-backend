export class ApplicationError extends Error {
  public status: number

  constructor(message, status) {
    super(message)

    this.name = this.constructor.name

    Error.captureStackTrace(this, this.constructor)

    this.status = status || 500
  }
}
