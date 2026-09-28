import { LitElement, html, css, nothing, type TemplateResult } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { Appliance, resolvePrefix } from './entities'
import { RUNNING_STATES, type EntityKey, type LgWashingCardConfig } from './types'
import { fireMoreInfo, type HomeAssistant, type LovelaceCardConfig } from './ha'

const CARD_TYPE = 'lg-washing-card'
const VERSION = '0.1.0'

/** Option flags, paired with the switch that stages the same option for the next run. */
const OPTIONS: ReadonlyArray<{ reported: EntityKey; control: EntityKey; label: string; icon: string }> = [
    { reported: 'steam', control: 'setSteam', label: 'Steam', icon: 'M8 2a4 4 0 0 1 0 8 4 4 0 0 0 0 8' },
    { reported: 'preWash', control: 'setPreWash', label: 'Pre-wash', icon: '' },
    { reported: 'turbowash', control: 'setTurbowash', label: 'TurboWash', icon: '' },
    { reported: 'creaseCare', control: 'setCreaseCare', label: 'Crease care', icon: '' },
    { reported: 'steamSoftener', control: 'setSteamSoftener', label: 'Steam softener', icon: '' },
    { reported: 'medicRinse', control: 'setMedicRinse', label: 'Medic rinse', icon: '' },
]

const SELECTS: ReadonlyArray<{ key: EntityKey; label: string }> = [
    { key: 'setCourse', label: 'Course' },
    { key: 'setTemperature', label: 'Temperature' },
    { key: 'setSpin', label: 'Spin' },
    { key: 'setRinse', label: 'Rinse' },
    { key: 'setWashLevel', label: 'Wash level' },
]

const minutes = (value: number | undefined) => {
    if (value === undefined) return '—'
    const h = Math.floor(value / 60)
    const m = value % 60
    return h ? `${h}:${String(m).padStart(2, '0')}` : `${m} min`
}

@customElement(CARD_TYPE)
export class LgWashingCard extends LitElement {
    @property({ attribute: false }) public hass?: HomeAssistant
    @state() private _config?: LgWashingCardConfig

    public setConfig(config: LovelaceCardConfig): void {
        const typed = config as LgWashingCardConfig
        if (!typed.device_id && !typed.prefix) {
            throw new Error('Pick the washing machine, or set `prefix` to its entity slug')
        }
        this._config = { show_controls: true, ...typed }
    }

    public getCardSize(): number {
        return this._config?.show_controls === false ? 4 : 9
    }

    public static getStubConfig(): Partial<LgWashingCardConfig> {
        return { prefix: 'lg_washer' }
    }

    private get _appliance(): Appliance | undefined {
        if (!this.hass || !this._config) return undefined
        const prefix = resolvePrefix(this.hass, this._config.device_id, this._config.prefix)
        return prefix ? new Appliance(this.hass, prefix) : undefined
    }

    // --- actions -------------------------------------------------------------------------------

    private _press(app: Appliance, key: EntityKey) {
        this.hass?.callService('button', 'press', {}, { entity_id: app.id(key) })
    }

    private _toggle(app: Appliance, key: EntityKey, on: boolean) {
        this.hass?.callService('switch', on ? 'turn_on' : 'turn_off', {}, { entity_id: app.id(key) })
    }

    private _select(app: Appliance, key: EntityKey, option: string) {
        this.hass?.callService('select', 'select_option', { option }, { entity_id: app.id(key) })
    }

    private _setNumber(app: Appliance, key: EntityKey, value: number) {
        this.hass?.callService('number', 'set_value', { value }, { entity_id: app.id(key) })
    }

    private _moreInfo(app: Appliance, key: EntityKey) {
        fireMoreInfo(this, app.id(key))
    }

    // --- render --------------------------------------------------------------------------------

    protected override render(): TemplateResult | typeof nothing {
        if (!this.hass || !this._config) return nothing
        const app = this._appliance
        if (!app || !app.present) {
            return html`<ha-card
                ><div class="missing">
                    Washing machine not found. Pick the device, or set <code>prefix</code> to its entity slug.
                </div></ha-card
            >`
        }

        return html`
            <ha-card>
                ${this._renderHeader(app)} ${this._renderError(app)} ${this._renderHero(app)}
                ${this._renderChips(app)}
                ${this._config.show_controls === false ? nothing : this._renderControls(app)}
                ${this._renderFooter(app)}
            </ha-card>
        `
    }

    private _renderHeader(app: Appliance) {
        const powered = app.on('power')
        return html`
            <div class="header">
                <div class="title">${this._config?.name ?? 'Washing machine'}</div>
                <button
                    class="power ${powered ? 'on' : ''}"
                    title=${powered ? 'Switch off' : 'Switch on'}
                    @click=${() => this._toggle(app, 'power', !powered)}
                >
                    ⏻
                </button>
            </div>
        `
    }

    private _renderError(app: Appliance) {
        if (!app.on('error')) return nothing
        return html`<div class="error" @click=${() => this._moreInfo(app, 'errorMessage')}>
            ${app.state('errorMessage') ?? 'Error'}
        </div>`
    }

    private _renderHero(app: Appliance) {
        // The downloaded course is the programme the owner actually chose; `course` reports the
        // built-in it is derived from, which is not what the panel shows them.
        const downloaded = app.state('downloadedCourse')
        const programme =
            downloaded && downloaded !== 'Not selected' ? downloaded : (app.state('course') ?? 'No programme')
        const status = app.state('status') ?? 'Unknown'
        const remaining = app.number('remainingTime')
        const initial = app.number('initialTime')
        const running = RUNNING_STATES.includes(status)
        // Guard the divide: the appliance reports both as 0 when idle.
        const progress = running && initial && remaining !== undefined ? (initial - remaining) / initial : 0

        return html`
            <div class="hero">
                <div class="programme" @click=${() => this._moreInfo(app, 'status')}>
                    <span class="name">${programme}</span>
                    <span class="status ${running ? 'running' : ''}">${status}</span>
                </div>
                <div class="remaining">${running || remaining ? minutes(remaining) : ''}</div>
            </div>
            ${running
                ? html`<div class="bar"><div class="fill" style="width:${Math.round(progress * 100)}%"></div></div>`
                : nothing}
            <div class="meta">
                ${this._metaItem(app, 'temperature', '°C')} ${this._metaItem(app, 'spin', 'rpm')}
                ${this._metaItem(app, 'rinse')} ${this._energyItem(app)}
            </div>
        `
    }

    private _metaItem(app: Appliance, key: EntityKey, unit?: string) {
        const value = app.state(key)
        if (value === undefined || value === 'Not selected') return nothing
        return html`<div class="meta-item" @click=${() => this._moreInfo(app, key)}>
            ${value}${unit ? html`<span class="unit">${unit}</span>` : nothing}
        </div>`
    }

    private _energyItem(app: Appliance) {
        const wh = app.number('energy')
        if (wh === undefined || wh === 0) return nothing
        return html`<div class="meta-item" @click=${() => this._moreInfo(app, 'energy')}>
            ${(wh / 1000).toFixed(2)}<span class="unit">kWh</span>
        </div>`
    }

    private _renderChips(app: Appliance) {
        const active = OPTIONS.filter((option) => app.on(option.reported))
        if (app.on('aiDd')) active.push({ reported: 'aiDd', control: 'aiDd', label: 'AI DD', icon: '' })
        if (!active.length) return nothing
        return html`<div class="chips">
            ${active.map((option) => html`<span class="chip">${option.label}</span>`)}
        </div>`
    }

    private _renderControls(app: Appliance) {
        const delay = app.number('setDelayedEnd')
        return html`
            <div class="controls">
                ${SELECTS.map((item) => this._renderSelect(app, item.key, item.label))}
                <label class="field">
                    <span class="label">Delayed end</span>
                    <input
                        class="input"
                        type="number"
                        min="0"
                        max="19"
                        step="1"
                        .value=${delay === undefined ? '' : String(delay)}
                        @change=${(event: Event) => {
                            const input = event.target as HTMLInputElement
                            this._setNumber(app, 'setDelayedEnd', Number(input.value))
                        }}
                    />
                </label>
                <div class="toggles">
                    ${OPTIONS.map(
                        (option) => html`
                            <button
                                class="toggle ${app.on(option.control) ? 'on' : ''}"
                                @click=${() => this._toggle(app, option.control, !app.on(option.control))}
                            >
                                ${option.label}
                            </button>
                        `,
                    )}
                </div>
            </div>
        `
    }

    private _renderSelect(app: Appliance, key: EntityKey, label: string) {
        const options = app.options(key)
        if (!options.length) return nothing
        const current = app.state(key) ?? ''
        return html`
            <label class="field">
                <span class="label">${label}</span>
                <select
                    class="input"
                    @change=${(event: Event) => this._select(app, key, (event.target as HTMLSelectElement).value)}
                >
                    ${options.map(
                        (option) => html`<option value=${option} ?selected=${option === current}>${option}</option>`,
                    )}
                </select>
            </label>
        `
    }

    private _renderFooter(app: Appliance) {
        // door_lock follows HA's lock convention: on means unlocked.
        const locked = app.state('doorLock') === 'off'
        const armed = app.on('remoteStart')
        const running = RUNNING_STATES.includes(app.state('status') ?? '')
        return html`
            <div class="footer">
                <div class="flags">
                    <span class="flag ${locked ? 'active' : ''}" @click=${() => this._moreInfo(app, 'doorLock')}>
                        ${locked ? 'Door locked' : 'Door unlocked'}
                    </span>
                    ${armed
                        ? nothing
                        : html`<span class="flag warn" title="Arm Remote Start on the appliance, or it ignores a start"
                              >Remote start off</span
                          >`}
                </div>
                <div class="actions">
                    ${running
                        ? html`<button class="action" @click=${() => this._press(app, 'pause')}>Pause</button>`
                        : nothing}
                    <button
                        class="action primary"
                        ?disabled=${!armed}
                        title=${armed ? 'Run the configured programme' : 'Remote start is not armed on the appliance'}
                        @click=${() => this._press(app, 'runProgramme')}
                    >
                        Run programme
                    </button>
                </div>
            </div>
        `
    }

    static override styles = css`
        ha-card {
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .title {
            font-size: 1.1rem;
            font-weight: 500;
        }
        .power {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1.2rem;
            color: var(--secondary-text-color);
            padding: 4px 8px;
            border-radius: 50%;
        }
        .power.on {
            color: var(--state-switch-active-color, var(--primary-color));
        }
        .error {
            background: var(--error-color, #db4437);
            color: var(--text-primary-color, #fff);
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
        }
        .hero {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 12px;
        }
        .programme {
            cursor: pointer;
            min-width: 0;
        }
        .name {
            display: block;
            font-size: 1.4rem;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .status {
            color: var(--secondary-text-color);
            font-size: 0.9rem;
        }
        .status.running {
            color: var(--primary-color);
        }
        .remaining {
            font-size: 1.6rem;
            font-variant-numeric: tabular-nums;
            white-space: nowrap;
        }
        .bar {
            height: 4px;
            border-radius: 2px;
            background: var(--divider-color);
            overflow: hidden;
        }
        .fill {
            height: 100%;
            background: var(--primary-color);
            transition: width 1s linear;
        }
        .meta {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            color: var(--secondary-text-color);
            font-size: 0.95rem;
        }
        .meta-item {
            cursor: pointer;
        }
        .unit {
            font-size: 0.8em;
            margin-left: 2px;
            opacity: 0.8;
        }
        .chips {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }
        .chip {
            background: var(--primary-color);
            color: var(--text-primary-color, #fff);
            border-radius: 12px;
            padding: 2px 10px;
            font-size: 0.8rem;
        }
        .controls {
            border-top: 1px solid var(--divider-color);
            padding-top: 12px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 10px;
        }
        .field {
            display: flex;
            flex-direction: column;
            gap: 4px;
            min-width: 0;
        }
        .label {
            font-size: 0.75rem;
            color: var(--secondary-text-color);
        }
        .input {
            width: 100%;
            box-sizing: border-box;
            padding: 8px;
            border-radius: 8px;
            border: 1px solid var(--divider-color);
            background: var(--card-background-color);
            color: var(--primary-text-color);
            font-size: 0.95rem;
        }
        .toggles {
            grid-column: 1 / -1;
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }
        .toggle {
            border: 1px solid var(--divider-color);
            background: none;
            color: var(--secondary-text-color);
            border-radius: 16px;
            padding: 6px 12px;
            cursor: pointer;
            font-size: 0.85rem;
        }
        .toggle.on {
            background: var(--primary-color);
            border-color: var(--primary-color);
            color: var(--text-primary-color, #fff);
        }
        .footer {
            border-top: 1px solid var(--divider-color);
            padding-top: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-wrap: wrap;
        }
        .flags {
            display: flex;
            gap: 10px;
            font-size: 0.85rem;
            color: var(--secondary-text-color);
        }
        .flag {
            cursor: pointer;
        }
        .flag.active {
            color: var(--primary-text-color);
        }
        .flag.warn {
            color: var(--warning-color, #ffa600);
            cursor: default;
        }
        .actions {
            display: flex;
            gap: 8px;
            margin-left: auto;
        }
        .action {
            border: 1px solid var(--divider-color);
            background: none;
            color: var(--primary-text-color);
            border-radius: 8px;
            padding: 8px 14px;
            cursor: pointer;
            font-size: 0.9rem;
        }
        .action.primary {
            background: var(--primary-color);
            border-color: var(--primary-color);
            color: var(--text-primary-color, #fff);
        }
        .action[disabled] {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .missing {
            padding: 16px;
            color: var(--secondary-text-color);
        }
    `
}

declare global {
    interface HTMLElementTagNameMap {
        [CARD_TYPE]: LgWashingCard
    }
}

window.customCards = window.customCards ?? []
window.customCards.push({
    type: CARD_TYPE,
    name: 'LG Washing Machine',
    description: 'Status and full programme control for an LG washer driven locally by rethink',
    preview: true,
})

// eslint-disable-next-line no-console
console.info(`%c ${CARD_TYPE} %c ${VERSION} `, 'background:#03a9f4;color:#fff', 'background:#555;color:#fff')
