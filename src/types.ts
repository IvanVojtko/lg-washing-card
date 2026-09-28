import type { LovelaceCardConfig } from './ha'

/**
 * Every entity the card reads or writes, keyed by the suffix rethink's MQTT discovery gives it.
 * The card resolves each one against a device rather than asking for 42 entity ids in the config.
 */
export const ENTITY_SUFFIXES = {
    // state
    status: 'sensor.status',
    course: 'sensor.course',
    downloadedCourse: 'sensor.downloaded_course',
    temperature: 'sensor.temperature',
    spin: 'sensor.spin',
    rinse: 'sensor.rinse',
    initialTime: 'sensor.initial_time',
    remainingTime: 'sensor.remaining_time',
    reserveTime: 'sensor.reserve_time',
    energy: 'sensor.energy',
    cycleCount: 'sensor.cycle_count',
    errorMessage: 'sensor.error_message',
    error: 'binary_sensor.error',
    doorLock: 'binary_sensor.door_lock',
    childLock: 'binary_sensor.child_lock',
    remoteStart: 'binary_sensor.remote_start',
    aiDd: 'binary_sensor.ai_dd',
    // the option flags as the appliance reports them
    steam: 'binary_sensor.steam',
    preWash: 'binary_sensor.pre_wash',
    turbowash: 'binary_sensor.turbowash',
    creaseCare: 'binary_sensor.crease_care',
    steamSoftener: 'binary_sensor.steam_softener',
    medicRinse: 'binary_sensor.medic_rinse',
    // controls
    setCourse: 'select.set_course',
    setTemperature: 'select.set_temperature',
    setSpin: 'select.set_spin',
    setRinse: 'select.set_rinse',
    setWashLevel: 'select.set_wash_level',
    setDelayedEnd: 'number.set_delayed_end',
    setSteam: 'switch.set_steam',
    setPreWash: 'switch.set_pre_wash',
    setTurbowash: 'switch.set_turbowash',
    setCreaseCare: 'switch.set_crease_care',
    setSteamSoftener: 'switch.set_steam_softener',
    setMedicRinse: 'switch.set_medic_rinse',
    runProgramme: 'button.run_programme',
    pause: 'button.pause',
    resume: 'button.start',
    // The power switch is published with an empty name, so HA names it after the device alone:
    // `switch.<prefix>` rather than `switch.<prefix>_power`. The empty suffix says so.
    power: 'switch.',
} as const

export type EntityKey = keyof typeof ENTITY_SUFFIXES

export interface LgWashingCardConfig extends LovelaceCardConfig {
    /** Preferred. Every entity is resolved from the device's own registry entries. */
    device_id?: string
    /**
     * Fallback for a setup where the entities were renamed away from their device, or where the
     * card is configured by hand. Entity ids are built as `<domain>.<prefix>_<suffix>`.
     */
    prefix?: string
    name?: string
    /** Hide the configuration section, leaving status plus Run/Pause/power. */
    show_controls?: boolean
}

/** The phases the appliance reports, in the order a wash passes through them. */
export const RUNNING_STATES = [
    'Measuring',
    'Pre-wash',
    'Washing',
    'Rinsing',
    'Spinning',
    'Drying',
    'Cooling',
    'Steam softening',
    'Refreshing',
]
