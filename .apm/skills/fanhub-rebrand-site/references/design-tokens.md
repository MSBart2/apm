# Design Tokens — FanHub Rebrand Template

> **Fill this in during Phase 0 of the rebrand-site skill.**
> Phase 2 reads from this file: the `:root {}` token set goes into `app.css`,
> the Google Fonts import goes into `App.razor` / `index.html`.
>
> Replace every `{PLACEHOLDER}` with the researched value before proceeding.

---

## Part 1 — Color Tokens

| Token                | Value                  | Source / reasoning                                            |
| -------------------- | ---------------------- | ------------------------------------------------------------- |
| **Show name**        | `{SHOW_NAME}`          | Universe file                                                 |
| **Background color** | `{COLOR_BG}`           | e.g. `#0a0a0a` — dominant dark tone from key art              |
| **Surface color**    | `{COLOR_SURFACE}`      | e.g. `#1a1a1a` — one step lighter than bg, for cards          |
| **Surface alt**      | `{COLOR_SURFACE_ALT}`  | e.g. `#2a2a2a` — inputs, borders                              |
| **Border**           | `{COLOR_BORDER}`       | e.g. `#2e2e2e` — subtle dividers                              |
| **Accent**           | `{COLOR_ACCENT}`       | e.g. `#c8a45a` — most distinctive brand color                 |
| **Accent hover**     | `{COLOR_ACCENT_HOVER}` | e.g. `#d4b46a` — accent lightened ~10%                        |
| **Accent muted**     | `{COLOR_ACCENT_MUTED}` | e.g. `rgba(200,164,90,0.15)` — accent at 15% opacity          |
| **Deceased/danger**  | `{COLOR_DECEASED}`     | e.g. `#8b1a1a` — threat/blood tone from key art               |
| **Error bg**         | `{COLOR_ERROR_BG}`     | e.g. `#1a0a00` — accent tinted very dark for Blazor error bar |
| **Text primary**     | `{COLOR_TEXT}`         | e.g. `#e8e0d0` — primary readable text                        |
| **Text muted**       | `{COLOR_TEXT_MUTED}`   | e.g. `#a09880` — dates, captions, metadata                    |
| **Display font**     | `{FONT_DISPLAY}`       | e.g. `Playfair Display` — from show's title card typography   |
| **Body font**        | `{FONT_BODY}`          | e.g. `Inter` — clean pairing for UI text                      |

### Token Set (CSS — fill in and apply in app.css)

```css
:root {
  /* Show: {SHOW_NAME} */

  /* ── Backgrounds ────────────────────────────────────────── */
  --color-bg:           {COLOR_BG};
  --color-surface:      {COLOR_SURFACE};
  --color-surface-alt:  {COLOR_SURFACE_ALT};
  --color-border:       {COLOR_BORDER};

  /* ── Brand ──────────────────────────────────────────────── */
  --color-accent:       {COLOR_ACCENT};
  --color-accent-hover: {COLOR_ACCENT_HOVER};
  --color-accent-muted: {COLOR_ACCENT_MUTED};
  --color-danger:       {COLOR_DECEASED};
  --color-error-bg:     {COLOR_ERROR_BG};

  /* ── Text ───────────────────────────────────────────────── */
  --color-text:         {COLOR_TEXT};
  --color-text-muted:   {COLOR_TEXT_MUTED};

  /* ── Typography ─────────────────────────────────────────── */
  --font-display: '{FONT_DISPLAY}', Georgia, serif;
  --font-body:    '{FONT_BODY}', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', monospace;

  /* ── Geometry ────────────────────────────────────────────── */
  --radius-sm:   3px;
  --radius-md:   6px;
  --radius-lg:   12px;
  --shadow-card: 0 2px 12px rgba(0,0,0,0.4);
}
```

### Color Replacements (find → replace, applied to all files)

The FanHub codebase ships with Breaking Bad's green palette. Replace these everywhere:

| Find                                                       | Replace with                   |
| ---------------------------------------------------------- | ------------------------------ |
| `#62d962`                                                  | `{COLOR_ACCENT}`               |
| `#2a8c2a`                                                  | `{COLOR_ACCENT}`               |
| `#4caf50`                                                  | `{COLOR_ACCENT}`               |
| `#fafafa`                                                  | `{COLOR_BG}`                   |
| `#f7f7f7`                                                  | `{COLOR_BG}`                   |
| `lightyellow`                                              | `{COLOR_ERROR_BG}`             |
| `rgb(5, 39, 103)`                                          | `{COLOR_BG}`                   |
| `#3a0647`                                                  | `{COLOR_SURFACE}`              |
| `linear-gradient(180deg, rgb(5, 39, 103) 0%, #3a0647 70%)` | `background-color: {COLOR_BG}` |
| `rgba(255,255,255,0.37)`                                   | `{COLOR_ACCENT_MUTED}`         |
| `rgba(255,255,255,0.1)`                                    | accent at 8% opacity           |

### Google Fonts Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family={FONT_DISPLAY_URL}:wght@700;900&family={FONT_BODY_URL}:wght@400;500;600&display=swap"
  rel="stylesheet"
/>
```

> URL-encode spaces as `+` in the font name (e.g. `Playfair+Display`, `Bebas+Neue`, `Inter`).

---

## Part 3 — Show Personality → UI Language

> Fill in during Phase 0, Track B. Concrete design decisions derived from Part 2.

| Show attribute       | UI decision                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------- |
| Era/physical texture | `{ATMOSPHERE_TECHNIQUE}` _(e.g. "Film grain overlay + radial vignette")_                      |
| Power metaphor       | `{ACCENT_USAGE}` _(e.g. "Accent as border + CTA fill — not body text")_                       |
| Emotional register   | `{SPACING_DENSITY}` _(e.g. "Tight spacing — 0.75rem gaps — dense document feel")_             |
| Typography era       | `{LABEL_STYLE}` _(e.g. "All-caps, 0.2em letter-spacing for section labels")_                  |
| Iconic objects       | `{DECORATIVE_MOTIF}` _(e.g. "Diagonal razor blade CSS divider, corner bracket on cards")_     |
| Physical world       | `{HERO_GRADIENT}` _(e.g. "Layered radial gradients suggesting coal smoke over city skyline")_ |

---

## Part 4 — Component Aesthetic Briefs

> These briefs define WHAT to build for each component, not just what colors to use.
> Write one paragraph per component, then implement from the brief.

### Hero Section

`{HERO_BRIEF}`

_Example (Peaky Blinders):_

> Full-viewport hero. Layered radial gradient background suggesting coal smoke over Birmingham
> rooftops — deep amber-black with darker focal point. Show title in stacked Playfair Display
> at 7rem, weight 900, tight leading. Tagline: "By Order of the Peaky Blinders" in tracked
> caps below. Three stats (6 Series, 36 Episodes, BBC) displayed as a dossier row with
> accent-colored numbers. Faint grain overlay visible. No photography — atmosphere created
> entirely through CSS and typography.

_Example (The Expanse):_

> Full-viewport. Deep space gradient — near-black with cold blue-purple nebula at top-right.
> "THE EXPANSE" in Orbitron at 5rem, tracked +0.3em, weight 900. "Humanity's Last Frontier"
> in small mono caps. Ring Gate silhouette as CSS gradient shape bottom-right. Subtle star
> field via CSS box-shadow pattern. Stats formatted as system readout with classification labels.

### Character Cards

`{CHARACTER_CARD_BRIEF}`

_Example (Peaky Blinders):_

> Cards styled as Birmingham police dossier files. Dark surface with corner bracket accents
> in amber. "INTELLIGENCE FILE — {CharacterType}" as a tracked uppercase label top-left.
> Four-digit case number in mono font upper-right. Photo area with a subtle vignette.
> Character name in Playfair Display. Bio text in a ruled left-border block (doc-rule).
> Status badge: alive = amber pill, deceased = crimson pill. Hover: corner brackets
> brighten, subtle amber glow on the card border.

### Episode Listings

`{EPISODE_BRIEF}`

_Example (Peaky Blinders):_

> Episode cards styled as theater playbill entries. Amber header band with "SERIES {n} ·
> EPISODE {n}" in tracked caps on dark amber. Episode title in Playfair Display below.
> Description in body text. Feels like a Hippodrome Birmingham program from 1919.

### Quotes

`{QUOTE_BRIEF}`

_Example (Peaky Blinders):_

> Telegram aesthetic. "TRANSCRIPT · {CHARACTER} · {EPISODE}" as a tracked label header
> with an amber bottom border. Quote text in Playfair Display italic at 1.4rem, large
> amber opening quotation mark. Attribution line in small tracked caps. Card has a subtle
> paper-texture effect via layered gradient. Like reading a wartime telegram.

---

## How to Derive Values (guidance for Phase 0)

### Accent color

The accent is the show's **most iconic single color** — the one color you'd pick if you
could only use one. Look at: logo text color, neon signs in key art, dominant foreground color.

- Breaking Bad → `#62d962` (poison green)
- Peaky Blinders → `#c8a45a` (whiskey amber / razor brass)
- The Expanse → `#4a9eff` (reactor blue)
- Game of Thrones → `#c5a028` (Lannister gold)
- Stranger Things → `#e50914` (demogorgon red)
- The Wire → `#b8860b` (Baltimore streetlight amber)

### Error background

Take the accent hex → darken to ~5% luminance, tinted with accent hue.
Accent `#c8a45a` (amber) → error bg `#1a0a00`.
Accent `#4a9eff` (blue) → error bg `#000a1a`.
Accent `#c5a028` (gold) → error bg `#1a1500`.

### Display font

Search `"{show name}" title card font` or `"{show name}" logo font`.
Find a Google Fonts equivalent. Serif for period dramas; geometric sans for sci-fi; condensed for modern crime.

| Genre                    | Font recommendation                              |
| ------------------------ | ------------------------------------------------ |
| Period drama (pre-1950)  | Playfair Display, Libre Baskerville, EB Garamond |
| Noir / crime (1950s–70s) | Bebas Neue, Oswald, Roboto Condensed             |
| Sci-fi / space           | Orbitron, Space Grotesk, Exo 2                   |
| Fantasy / medieval       | Cinzel, Cormorant Garamond, MedievalSharp        |
| 1980s / retro            | Montserrat, Raleway, Anton                       |
| Modern thriller          | Inter, DM Sans, Plus Jakarta Sans                |

---

## Phase 0 Research Output

| Token                | Value                  | Source / reasoning                                                |
| -------------------- | ---------------------- | ----------------------------------------------------------------- |
| **Show name**        | `{SHOW_NAME}`          | Universe file                                                     |
| **Background color** | `{COLOR_BG}`           | e.g. `#0a0a0a` — dominant dark tone from key art                  |
| **Surface color**    | `{COLOR_SURFACE}`      | e.g. `#1a1a1a` — one step lighter than bg, for cards              |
| **Surface alt**      | `{COLOR_SURFACE_ALT}`  | e.g. `#2a2a2a` — inputs, borders                                  |
| **Accent**           | `{COLOR_ACCENT}`       | e.g. `#c8a45a` — most distinctive brand color                     |
| **Accent hover**     | `{COLOR_ACCENT_HOVER}` | e.g. `#d4b46a` — accent lightened ~10%                            |
| **Accent muted**     | `{COLOR_ACCENT_MUTED}` | e.g. `rgba(200,164,90,0.15)` — accent at 15% opacity              |
| **Deceased/danger**  | `{COLOR_DECEASED}`     | e.g. `#8b1a1a` — threat/blood tone from key art                   |
| **Error bg**         | `{COLOR_ERROR_BG}`     | e.g. `#1a0a00` — accent tinted very dark for Blazor error bar     |
| **Text primary**     | `{COLOR_TEXT}`         | e.g. `#e8e0d0` — primary readable text                            |
| **Text muted**       | `{COLOR_TEXT_MUTED}`   | e.g. `#a09880` — dates, captions, metadata                        |
| **Display font**     | `{FONT_DISPLAY}`       | e.g. `Playfair Display` — from show's title card typography       |
| **Body font**        | `{FONT_BODY}`          | e.g. `Inter` — clean pairing for UI text                          |
| **Visual motifs**    | `{MOTIFS}`             | e.g. `smoke gradients, razor blade dividers, industrial texture`  |
| **Era / aesthetic**  | `{AESTHETIC}`          | e.g. `1920s industrial Birmingham`, `near-future dystopian`, etc. |

---

## How to Derive Values (guidance for Phase 0)

### Background color

Search `"{show name}" title card` or `"{show name}" poster`. The darkest dominant background
color is usually `#000000` to `#1a1a1a`. Pick the value that matches the poster's shadow areas.

### Accent color

The accent is the show's **most iconic single color** — the one color you'd pick if you could
only use one. Look at: logo text color, neon signs in key art, dominant foreground color.

Examples:

- Breaking Bad → `#62d962` (poison green, Heisenberg hat, RV)
- Peaky Blinders → `#c8a45a` (brass/whiskey amber, razor caps, 1920s gold)
- Stranger Things → `#e50914` (Netflix red + demogorgon red)
- The Wire → `#b8860b` (Baltimore streetlight gold)

### Deceased/danger color

Search for secondary color in key art associated with threat, violence, or death.
Default to a deep crimson `#8b1a1a` if no clear show-specific color emerges.

### Error background

Take the accent hex, zero out all channels except the dominant channel, then darken to ~5% luminance.
Rule of thumb: accent `#RRGGBB` → error bg `#0R0000` or `#00G000` etc., very dark.
Example: accent `#c8a45a` (amber) → error bg `#1a0a00`.

### Display font

Search `"{show name}" title card font` or `"{show name}" logo font`.
Find a Google Fonts equivalent. Serif fonts work for period dramas; sans-serif for modern/sci-fi.
If no result: period dramas → `Playfair Display`; sci-fi → `Orbitron`; crime/noir → `Bebas Neue`.

### Body font

`Inter` is a safe default for any show — clean, readable, neutral.
Only change if the show has a strong typographic identity that carries to UI text.

---
