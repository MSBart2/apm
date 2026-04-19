# CSS Patterns — FanHub Rebrand

> Copy-paste CSS patterns for Phase 2 of the rebrand-site skill.
> Each pattern is genre-tagged. Choose the patterns that match the
> Component Aesthetic Briefs from Phase 0.

---

## Atmosphere Layer

Add ONE or more of the following to `app.css` / `global.css` based on the show's
physical world. These are applied at the `body` level and affect every page.

### Film Grain / Noise Overlay

_Use for: period dramas, gritty crime, analog shows, anything pre-digital_

```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 200px 200px;
  opacity: 0.4;
  mix-blend-mode: overlay;
}
```

### Vignette

_Use for: cinematic/prestige shows, anything that should feel like a film frame_

```css
body::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9998;
  background: radial-gradient(
    ellipse at center,
    transparent 60%,
    rgba(0, 0, 0, 0.6) 100%
  );
}
```

### Subtle Scanline

_Use for: sci-fi, cyberpunk, retro-digital shows_

```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 4px
  );
}
```

---

## Hero Gradients

Applied to `.hero` or the homepage hero section. Must reflect the show's physical world —
not a generic dark gradient.

### Coal Smoke / Industrial City

_Use for: Peaky Blinders, period crime, Victorian/Edwardian, industrial era_

```css
.hero {
  background:
    radial-gradient(
      ellipse 80% 60% at 50% 40%,
      rgba(30, 15, 0, 0.7) 0%,
      transparent 70%
    ),
    radial-gradient(
      ellipse 120% 80% at 20% 80%,
      rgba(10, 5, 0, 0.9) 0%,
      transparent 60%
    ),
    linear-gradient(180deg, #0a0402 0%, #150b00 50%, #0a0402 100%);
}
```

### Deep Space Void

_Use for: The Expanse, Battlestar Galactica, Firefly, any space setting_

```css
.hero {
  background:
    radial-gradient(
      ellipse 40% 40% at 70% 30%,
      rgba(0, 40, 80, 0.5) 0%,
      transparent 60%
    ),
    radial-gradient(
      ellipse 60% 60% at 30% 70%,
      rgba(0, 10, 40, 0.3) 0%,
      transparent 50%
    ),
    linear-gradient(180deg, #000008 0%, #050510 100%);
}
```

### Cold Stone / Medieval

_Use for: Game of Thrones, House of the Dragon, historical fantasy_

```css
.hero {
  background:
    radial-gradient(
      ellipse 100% 50% at 50% 100%,
      rgba(20, 0, 0, 0.6) 0%,
      transparent 60%
    ),
    linear-gradient(180deg, #0c0c0e 0%, #141018 100%);
}
```

### Desert / Arid Southwest

_Use for: Breaking Bad, Better Call Saul, Yellowstone, Westworld_

```css
.hero {
  background:
    radial-gradient(
      ellipse 80% 40% at 50% 0%,
      rgba(40, 20, 0, 0.5) 0%,
      transparent 60%
    ),
    linear-gradient(180deg, #0a0500 0%, #1a0d00 50%, #0a0500 100%);
}
```

### Neon / Rain-Slicked City Night

_Use for: True Detective, Mr. Robot, Blade Runner-adjacent, noir_

```css
.hero {
  background:
    radial-gradient(
      ellipse 50% 60% at 80% 50%,
      rgba(0, 60, 80, 0.3) 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse 40% 40% at 20% 80%,
      rgba(80, 0, 40, 0.2) 0%,
      transparent 50%
    ),
    linear-gradient(180deg, #000000 0%, #040810 100%);
}
```

### English Countryside / Manor

_Use for: Downton Abbey, The Crown, period British dramas in green settings_

```css
.hero {
  background:
    radial-gradient(
      ellipse 100% 60% at 50% 100%,
      rgba(0, 20, 0, 0.5) 0%,
      transparent 60%
    ),
    linear-gradient(180deg, #050805 0%, #0a100a 100%);
}
```

---

## Decorative System

Pick 2–3 patterns that match the show's iconic objects and Component Aesthetic Brief.
Do not use all of them.

### Diagonal Blade Divider

_Use for: Peaky Blinders, crime shows, anything with a razor/weapon motif_

```css
.divider-blade {
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--color-accent) 20%,
    var(--color-accent) 80%,
    transparent 100%
  );
  position: relative;
  margin: 2rem 0;
}
.divider-blade::before {
  content: "";
  position: absolute;
  left: 50%;
  top: -4px;
  transform: translateX(-50%) rotate(45deg);
  width: 10px;
  height: 10px;
  background: var(--color-accent);
}
```

### Accent Side Rule (Doc Rule)

_Use for: dossier/document aesthetic, police files, telegram-style layouts_

```css
.doc-rule {
  border-left: 3px solid var(--color-accent);
  padding-left: 1rem;
}
```

### Corner Bracket Decoration

_Use for: file/evidence aesthetic, government records, intelligence dossiers_

```css
.bracket-corner {
  position: relative;
}
.bracket-corner::before,
.bracket-corner::after {
  content: "";
  position: absolute;
  width: 14px;
  height: 14px;
}
.bracket-corner::before {
  top: 0;
  left: 0;
  border-top: 2px solid var(--color-accent);
  border-left: 2px solid var(--color-accent);
}
.bracket-corner::after {
  bottom: 0;
  right: 0;
  border-bottom: 2px solid var(--color-accent);
  border-right: 2px solid var(--color-accent);
}
```

### Horizontal Rule with Glyph

_Use for: fantasy, heraldic, medieval — replaces generic `<hr>`_

```css
.divider-rune {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--color-accent);
  margin: 2rem 0;
}
.divider-rune::before,
.divider-rune::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--color-border);
}
```

### Mono Scan Line (Classification Rule)

_Use for: sci-fi, military, systems/AI shows_

```css
.divider-scan {
  height: 1px;
  background: var(--color-accent);
  position: relative;
  margin: 1.5rem 0;
  opacity: 0.5;
}
.divider-scan::before {
  content: "────────────────────";
  position: absolute;
  top: -0.6rem;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 0.5rem;
  letter-spacing: 0.2em;
  color: var(--color-accent);
  background: var(--color-bg);
  padding: 0 0.5rem;
}
```

---

## Typography Scale

Copy into `app.css`. Adjust `{ERA_TRACKING}` and `{ERA_CASE}` based on Phase 0:

- Period drama → `letter-spacing: 0.05em`, `text-transform: uppercase`
- Modern/thriller → `letter-spacing: -0.01em`, `text-transform: none`
- Sci-fi → `letter-spacing: 0.1em`, `text-transform: uppercase`

```css
/* Hero / show title — maximum presence */
.text-hero {
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 7rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

/* Section headers */
.text-section {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  /* Adjust per era: */
  letter-spacing: 0.05em; /* period → 0.05em | modern → -0.01em | sci-fi → 0.1em */
  text-transform: uppercase; /* period/sci-fi → uppercase | modern → none */
}

/* Era label / classification / case number */
.text-label {
  font-family: var(--font-body);
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

/* Large quote / pull text */
.text-quote {
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 2.5vw, 1.6rem);
  font-style: italic;
  line-height: 1.5;
  color: var(--color-text);
}
```

---

## Card Language

Each card style fits a different show archetype. Use the one matching the
Component Aesthetic Brief for this show. Apply to both `.card-dossier`,
`.card-file`, or `.card-playbill` in `app.css`.

### Dossier / Police File Card

_Use for: Peaky Blinders, The Wire, True Detective, Line of Duty — period or gritty crime_

```css
.card-dossier {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  position: relative;
  padding: 1.5rem;
  transition: border-color 0.2s ease;
}
.card-dossier:hover {
  border-color: var(--color-accent);
}
/* Corner bracket accent */
.card-dossier::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  border-top: 2px solid var(--color-accent);
  border-left: 2px solid var(--color-accent);
  transition:
    width 0.2s,
    height 0.2s;
}
.card-dossier::after {
  content: "";
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  border-bottom: 2px solid var(--color-accent);
  border-right: 2px solid var(--color-accent);
}
.card-dossier:hover::before,
.card-dossier:hover::after {
  width: 30px;
  height: 30px;
}
```

### Personnel File Card

_Use for: The Expanse, Battlestar Galactica, 24, Homeland — sci-fi or military/intelligence_

```css
.card-file {
  background: var(--color-surface);
  border-top: 3px solid var(--color-accent);
  border-left: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  padding: 1.5rem;
  transition: box-shadow 0.2s ease;
}
.card-file:hover {
  box-shadow: 0 0 0 1px var(--color-accent);
}
```

### Playbill / Theater Card

_Use for: period entertainment, theater, any show with a stage/performance element_

```css
.card-playbill {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 0;
  overflow: hidden;
}
.card-playbill .card-header {
  background: var(--color-accent);
  color: var(--color-bg);
  padding: 0.4rem 1rem;
  font-family: var(--font-display);
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
.card-playbill .card-body {
  padding: 1.25rem;
}
```

### Broadsheet / Newspaper Card

_Use for: crime dramas, journalism shows, anything newspaper-adjacent_

```css
.card-broadsheet {
  background: var(--color-surface);
  border-bottom: 2px solid var(--color-accent);
  padding: 1.25rem 1.25rem 1rem;
  border-top: 1px solid var(--color-border);
  border-left: none;
  border-right: none;
}
.card-broadsheet .card-dateline {
  font-family: var(--font-body);
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
}
```

---

## Status Badges

Consistent for all shows. Swap colors via tokens.

```css
.badge {
  display: inline-block;
  padding: 0.2em 0.65em;
  border-radius: 2px;
  font-family: var(--font-body);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 600;
}
.badge-alive {
  background: var(--color-accent-muted);
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
}
.badge-deceased {
  background: rgba(139, 26, 26, 0.15);
  color: var(--color-danger);
  border: 1px solid var(--color-danger);
}
```
