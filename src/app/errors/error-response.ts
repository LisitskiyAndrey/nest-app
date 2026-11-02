export interface ErrorResponse {
  statusCode: number
  code: string
  message: string
  details?: Record<string, unknown>
  timestamp: string
  path: string
}
