import { Injectable } from '@nestjs/common'
import * as argon2 from 'argon2'

import type { PasswordHasherPort } from '@/modules/auth/application/ports/password-hasher-port'

const ARGON2_OPTIONS: argon2.Options & { raw?: false } = {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 1,
}

@Injectable()
export class Argon2PasswordHasher implements PasswordHasherPort {
  hash(value: string): Promise<string> {
    return argon2.hash(value, ARGON2_OPTIONS)
  }

  async verify(hash: string, plain: string): Promise<boolean> {
    if (!hash || !plain) {
      return false
    }

    try {
      return await argon2.verify(hash, plain)
    } catch {
      return false
    }
  }
}
