import type { ConfigService } from '@nestjs/config'

export const DEFAULT_ACCESS_TOKEN_EXPIRES_IN = '15m'
export const DEFAULT_REFRESH_TOKEN_EXPIRES_IN = '30d'

type JwtDurationUnit = 'ms' | 's' | 'm' | 'h' | 'd'
type JwtDuration = `${number}${JwtDurationUnit}`

interface JwtTokenConfig {
  secret: string
  expiresIn: JwtDuration
}

export function getAccessTokenConfig(config: ConfigService): JwtTokenConfig {
  return {
    secret: getSecret(config, 'JWT_ACCESS_SECRET', 'JWT_SECRET'),
    expiresIn: getDuration(config, 'JWT_ACCESS_EXPIRES_IN', DEFAULT_ACCESS_TOKEN_EXPIRES_IN),
  }
}

export function getRefreshTokenConfig(config: ConfigService): JwtTokenConfig {
  return {
    secret: getSecret(config, 'JWT_REFRESH_SECRET', 'JWT_SECRET'),
    expiresIn: getDuration(config, 'JWT_REFRESH_EXPIRES_IN', DEFAULT_REFRESH_TOKEN_EXPIRES_IN),
  }
}

export function getRefreshSessionTtlMs(config: ConfigService): number {
  return parseDurationMs(
    getDuration(config, 'JWT_REFRESH_EXPIRES_IN', DEFAULT_REFRESH_TOKEN_EXPIRES_IN),
  )
}

function getSecret(config: ConfigService, key: string, fallbackKey: string): string {
  const value = getOptionalString(config, key)

  if (value) {
    return value
  }

  const fallbackValue = getOptionalString(config, fallbackKey)

  if (fallbackValue) {
    return fallbackValue
  }

  return config.getOrThrow<string>(key)
}

function getDuration(config: ConfigService, key: string, fallbackValue: JwtDuration): JwtDuration {
  const value = getOptionalString(config, key)

  if (!value) {
    return fallbackValue
  }
  assertDuration(value)

  return value
}

function getOptionalString(config: ConfigService, key: string): string | undefined {
  const value = config.get<string>(key)?.trim()
  return value || undefined
}

function assertDuration(value: string): asserts value is JwtDuration {
  if (!/^\d+(ms|s|m|h|d)$/.test(value)) {
    throw new Error(`Invalid duration value: ${value}`)
  }
}

function parseDurationMs(value: JwtDuration): number {
  const match = value.match(/^(\d+)(ms|s|m|h|d)$/)

  if (!match) {
    throw new Error(`Invalid duration value: ${value}`)
  }

  const amount = Number(match[1])
  const unit = match[2] as JwtDurationUnit

  const multipliers: Record<JwtDurationUnit, number> = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  }

  return amount * multipliers[unit]
}
