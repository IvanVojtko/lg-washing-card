import { ENTITY_SUFFIXES, type EntityKey } from './types'
import type { HassEntity, HomeAssistant } from './ha'

/**
 * Resolves the appliance's 42 entities from one device, rather than asking for all of them in the
 * card config.
 *
 * rethink names every entity `<domain>.<device slug>_<suffix>`, so one anchor entity gives the slug
 * and the rest follow. `sensor.*_status` is the anchor: every washer this card targets has it, and
 * deriving the slug from it is unambiguous where matching on a trailing suffix would not be -
 * `_course` alone matches both `course` and `downloaded_course`.
 */
export const resolvePrefix = (hass: HomeAssistant, deviceId?: string, configured?: string) => {
    if (configured) return configured
    if (!deviceId) return undefined
    for (const entry of Object.values(hass.entities)) {
        if (entry.device_id !== deviceId) continue
        const match = /^sensor\.(.+)_status$/.exec(entry.entity_id)
        if (match) return match[1]
    }
    return undefined
}

export const entityId = (prefix: string, key: EntityKey) => {
    const [domain, suffix] = ENTITY_SUFFIXES[key].split('.')
    return suffix ? `${domain}.${prefix}_${suffix}` : `${domain}.${prefix}`
}

export class Appliance {
    constructor(
        private readonly hass: HomeAssistant,
        private readonly prefix: string,
    ) {}

    entity(key: EntityKey): HassEntity | undefined {
        return this.hass.states[entityId(this.prefix, key)]
    }

    id(key: EntityKey) {
        return entityId(this.prefix, key)
    }

    /** Raw state, or undefined when the entity is missing or has no usable value. */
    state(key: EntityKey): string | undefined {
        const value = this.entity(key)?.state
        if (value === undefined || value === 'unknown' || value === 'unavailable') return undefined
        return value
    }

    number(key: EntityKey): number | undefined {
        const value = this.state(key)
        if (value === undefined) return undefined
        const parsed = Number(value)
        return Number.isFinite(parsed) ? parsed : undefined
    }

    on(key: EntityKey): boolean {
        return this.state(key) === 'on'
    }

    options(key: EntityKey): string[] {
        return this.entity(key)?.attributes.options ?? []
    }

    /** True once the appliance has published anything at all. */
    get present() {
        return this.entity('status') !== undefined
    }
}
