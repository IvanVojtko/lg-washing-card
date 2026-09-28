/**
 * The slice of Home Assistant's frontend interface this card uses.
 *
 * Declared here rather than pulled from `custom-card-helpers`: that package lags HA's own types,
 * and the card touches a small enough surface that a local declaration is both accurate and
 * checkable against what HA actually passes in.
 */

export interface HassEntityAttributes {
    friendly_name?: string
    unit_of_measurement?: string
    device_class?: string
    icon?: string
    options?: string[]
    min?: number
    max?: number
    step?: number
    [key: string]: unknown
}

export interface HassEntity {
    entity_id: string
    state: string
    attributes: HassEntityAttributes
    last_changed: string
    last_updated: string
}

/** The entity-registry view the frontend exposes, which is how a device maps to its entities. */
export interface EntityRegistryDisplayEntry {
    entity_id: string
    device_id?: string
    area_id?: string
    hidden?: boolean
    entity_category?: string
}

export interface DeviceRegistryEntry {
    id: string
    name?: string
    name_by_user?: string
    model?: string
    manufacturer?: string
}

export interface HomeAssistant {
    states: Record<string, HassEntity>
    entities: Record<string, EntityRegistryDisplayEntry>
    devices: Record<string, DeviceRegistryEntry>
    locale: { language: string }
    callService(
        domain: string,
        service: string,
        data?: Record<string, unknown>,
        target?: { entity_id?: string | string[] },
    ): Promise<unknown>
    formatEntityState?(entity: HassEntity): string
}

export interface LovelaceCardConfig {
    type: string
    [key: string]: unknown
}

export interface LovelaceCard extends HTMLElement {
    hass?: HomeAssistant
    setConfig(config: LovelaceCardConfig): void
    getCardSize?(): number
}

/** Registers the card with the picker in HA's dashboard editor. */
export interface CustomCardEntry {
    type: string
    name: string
    description: string
    preview?: boolean
    documentationURL?: string
}

declare global {
    interface Window {
        customCards?: CustomCardEntry[]
    }
}

/** HA listens for this to open the more-info dialog for an entity. */
export const fireMoreInfo = (node: HTMLElement, entityId: string): void => {
    node.dispatchEvent(
        new CustomEvent('hass-more-info', {
            detail: { entityId },
            bubbles: true,
            composed: true,
        }),
    )
}
