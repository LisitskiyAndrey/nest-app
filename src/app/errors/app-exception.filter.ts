import { AppError } from '@/app/errors/app-error'
import type { ErrorResponse } from '@/app/errors/error-response'
import { getHttpErrorCode } from '@/app/errors/http-error-code'
import { mapSystemError } from '@/app/errors/system-error.mapper'
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import type { Request, Response } from 'express'

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const appError = this.toAppError(exception)
    const payload: ErrorResponse = {
      statusCode: appError.statusCode,
      code: appError.code,
      message: appError.message,
      details: appError.details,
      timestamp: new Date().toISOString(),
      path: request.url,
    }

    if (appError.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url} -> ${appError.statusCode} ${appError.code}`,
        exception instanceof Error ? exception.stack : undefined,
      )
    }

    response.status(appError.statusCode).json(payload)
  }

  private toAppError(exception: unknown): AppError {
    if (exception instanceof AppError) {
      return exception
    }

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus()
      const response = exception.getResponse()
      const message = this.getHttpMessage(response, exception.message)
      const details = this.getHttpDetails(response)
      const code = this.getHttpCode(response, statusCode)

      return new AppError(message, {
        code,
        statusCode,
        details,
        cause: exception,
      })
    }

    return mapSystemError(exception)
  }

  private getHttpMessage(response: string | object, fallback: string): string {
    if (typeof response === 'string') {
      return response
    }

    if (response && 'message' in response) {
      const message = response.message
      if (Array.isArray(message)) {
        return message.join(', ')
      }
      if (typeof message === 'string') {
        return message
      }
    }

    return fallback
  }

  private getHttpDetails(response: string | object): Record<string, unknown> | undefined {
    if (!response || typeof response === 'string') {
      return undefined
    }

    const details: Record<string, unknown> = { ...response }

    if (Array.isArray(details.message)) {
      details.errors = details.message
    }

    delete details.message
    delete details.error
    delete details.statusCode
    delete details.code

    return Object.keys(details).length > 0 ? details : undefined
  }

  private getHttpCode(response: string | object, statusCode: number): string {
    if (
      response &&
      typeof response === 'object' &&
      'code' in response &&
      typeof response.code === 'string'
    ) {
      return response.code
    }

    return getHttpErrorCode(statusCode)
  }
}
