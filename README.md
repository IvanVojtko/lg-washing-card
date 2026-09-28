# lg-washing-card

[![CI](https://github.com/IvanVojtko/lg-washing-card/actions/workflows/ci.yml/badge.svg)](https://github.com/IvanVojtko/lg-washing-card/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/IvanVojtko/lg-washing-card?sort=semver)](https://github.com/IvanVojtko/lg-washing-card/releases)
[![hacs](https://img.shields.io/badge/HACS-custom-41BDF5.svg)](https://hacs.xyz)
[![licence](https://img.shields.io/github/license/IvanVojtko/lg-washing-card)](LICENSE)

A Lovelace card for an LG washing machine driven locally by
[rethink](https://github.com/anszom/rethink) — status at a glance, and the full programme
configuration in one place rather than spread across 42 entity rows.

Built for an **LG FSR7A04PG** (`Y_V8_Y___W.B32QEUK`), and it will fit any appliance whose
rethink device class publishes the same entity set.

## What it shows

- the programme actually selected — the **downloaded course** where there is one, falling back
  to the base course, because `course` reports the built-in a downloaded programme is derived
  from and that is not what the panel shows
- phase, time remaining and a progress bar while a cycle runs
- temperature, spin, rinse and energy
- the option flags the appliance reports, as chips
- an error banner when the appliance raises one, carrying the actual code

## What it controls

Course, temperature, spin, rinse and wash level; the six option switches; the delayed end; and
**Run programme**.

`F026`, the appliance's start command, is all-or-nothing — there is no way to set a field without
starting a wash. So the `set_*` entities hold a choice until Run programme is pressed, each
defaulting to what the appliance last reported. Press it untouched and it runs what the dial
already says.

**Run programme is disabled unless Remote Start is armed on the appliance.** Without it the machine
ignores a start however well-formed, and a button that silently does nothing is worse than one that
says why.

## Configuration

```yaml
type: custom:lg-washing-card
device_id: 538ca8eb359424b76dc06f5f36d089eb
name: Washing machine
```

| Option | Default | |
| --- | --- | --- |
| `device_id` | — | The appliance. Every entity is resolved from it. |
| `prefix` | — | Fallback when entities were renamed away from their device: ids are built as `<domain>.<prefix>_<suffix>`, e.g. `lg_washer`. One of `device_id` or `prefix` is required. |
| `name` | `Washing machine` | Card heading. |
| `show_controls` | `true` | `false` leaves status plus Run/Pause/power. |

Entities are resolved from one anchor — `sensor.<slug>_status` — rather than by matching trailing
suffixes, which would be ambiguous: `_course` matches both `course` and `downloaded_course`.

## Building

```bash
npm install
npm run build     # typecheck, then bundle to dist/lg-washing-card.js
npm run watch     # rebuild on change
```

Everything including lit is inlined: Home Assistant loads a resource as a single ES module, so
there are no externals and no code splitting. The filename is fixed rather than hashed, because the
resource URL in HA is fixed — cache-bust with the `?v=` query instead.

## Installing

### With HACS (recommended)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=IvanVojtko&repository=lg-washing-card)

The button opens this repository in HACS on your own Home Assistant. It is not yet in the default
store, so HACS will offer to add it as a custom repository — accept, then **Download**. HACS
registers the Lovelace resource for you.

If the button does not work, add it by hand: **HACS → ⋮ → Custom repositories**, URL
`https://github.com/IvanVojtko/lg-washing-card`, type **Dashboard**.

### By hand

Take `lg-washing-card.js` from a [release](https://github.com/IvanVojtko/lg-washing-card/releases),
or build it yourself, and copy it into Home Assistant's `www` directory:

```bash
scp dist/lg-washing-card.js root@nasserver:/opt/has/www/lg-washing-card/
```

Then **Settings → Dashboards → ⋮ → Resources → Add**, URL
`/local/lg-washing-card/lg-washing-card.js?v=0.1.0`, type **JavaScript module**. Bump the `?v=` on
every update or the browser will keep the old bundle. HACS does this part for you, which is the main
reason to prefer it.

`/opt/has/www` is Home Assistant's own directory on the host, outside the GitOps repo — the same
place HACS puts the cards it installs.

## Releasing

CI typechecks and builds every push and pull request, and validates the repository against HACS.

A release is cut by tagging:

```bash
npm version patch      # or minor / major - writes package.json and tags
git push --follow-tags
```

The release workflow refuses a tag that does not match `package.json`, because the tag is the
version HACS shows and the bundle logs to the browser console — a mismatch is a version that cannot
be traced back to a build. It then builds and attaches `lg-washing-card.js` to the release, which is
the file HACS downloads: a release without it installs nothing.
