const DURATION_PATTERN = /^\d+(ms|s|m|h|d)?$/

export type AppEnvironment = {
  DATABASE_URL: string
  JWT_SECRET: string
  JWT_ACCESS_SECRET?: string
  JWT_REFRESH_SECRET?: string
  JWT_ACCESS_EXPIRES_IN: string
  JWT_REFRESH_EXPIRES_IN: string
  PORT: number
  CORS_ORIGIN?: string
  THROTTLE_TTL_MS: number
  THROTTLE_LIMIT: number
}

export function validateEnv(config: Record<string, unknown>): AppEnvironment {
  return {
    DATABASE_URL: requiredString(config, 'DATABASE_URL'),
    JWT_SECRET: requiredString(config, 'JWT_SECRET'),
    JWT_ACCESS_SECRET: optionalString(config, 'JWT_ACCESS_SECRET'),
    JWT_REFRESH_SECRET: optionalString(config, 'JWT_REFRESH_SECRET'),
    JWT_ACCESS_EXPIRES_IN: duration(config, 'JWT_ACCESS_EXPIRES_IN', '15m'),
    JWT_REFRESH_EXPIRES_IN: duration(config, 'JWT_REFRESH_EXPIRES_IN', '30d'),
    PORT: numberValue(config, 'PORT', 3000),
    CORS_ORIGIN: optionalString(config, 'CORS_ORIGIN'),
    THROTTLE_TTL_MS: numberValue(config, 'THROTTLE_TTL_MS', 60_000),
    THROTTLE_LIMIT: numberValue(config, 'THROTTLE_LIMIT', 100),
  }
}

function requiredString(config: Record<string, unknown>, key: string): string {
  const value = optionalString(config, key)

  if (!value) {
    throw new Error(`${key} is required`)
  }

  return value
}

function optionalString(config: Record<string, unknown>, key: string): string | undefined {
  const value = config[key]

  if (typeof value !== 'string' || value.trim().length === 0) {
    return undefined
  }

  return value
}

function duration(config: Record<string, unknown>, key: string, fallback: string): string {
  const value = optionalString(config, key) ?? fallback

  if (!DURATION_PATTERN.test(value)) {
    throw new Error(`${key} must be a duration like 15m, 30d, 60s, or 1000ms`)
  }

  return value
}

function numberValue(config: Record<string, unknown>, key: string, fallback: number): number {
  const rawValue = config[key]
  const value = rawValue === undefined || rawValue === '' ? fallback : Number(rawValue)

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${key} must be a positive integer`)
  }

  return value
}
