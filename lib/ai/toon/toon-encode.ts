import { encode } from '@toon-format/toon'

import { TOON_TEMPLATES } from './toon-templates'
import type { ToonTemplateId } from './toon-types'

export function encodeToonPayload(input: unknown) {
  return encode(input, {
    keyFolding: 'safe',
    flattenDepth: 3,
  })
}

export function isToonTemplateId(value: unknown): value is ToonTemplateId {
  return typeof value === 'string' && value in TOON_TEMPLATES
}
