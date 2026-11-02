export type AppErrorDetails = Record<string, unknown> | undefined

export type AppErrorOptions = {
  code: string
  statusCode: number
  details?: AppErrorDetails
  cause?: unknown
}

export class AppError extends Error {
  readonly code: string
  readonly statusCode: number
  readonly details?: AppErrorDetails

  constructor(message: string, options: AppErrorOptions) {
    super(message, { cause: options.cause })
    this.name = new.target.name
    this.code = options.code
    this.statusCode = options.statusCode
    this.details = options.details
  }
}
