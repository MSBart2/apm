---
name: fanhub-rebrand-site
description: >
  Complete end-to-end FanHub site rebrand. Replaces all show content, seed data, and
  visual design for the currently focused language track only (determined by the
  "Active implementation" line in the project's AGENTS.md / copilot-instructions).
  Always driven by a universe file in /fanhubdocs/. Use when asked to "rebrand the
  site", "switch shows", "replace Breaking Bad with X", "do the rebrand", "implement
  the rebrand plan", or "run the rebrand". Follows the phased plan in
  /fanhubdocs/*-plan.md.
---

# Rebrand Site

Full end-to-end FanHub site rebrand for the **currently focused language track only**.
The focus language is determined by reading the `Active implementation` line in the
project's `AGENTS.md` (or `.github/copilot-instructions.md`). For example, if it says
`dotnet/`, only the dotnet backend and frontend are rebranded — other tracks are not
touched. Source of truth is always a universe file in `fanhubdocs/` and a plan file in
`fanhubdocs/`. The design system is **always derived from the target show** via deep
visual research — never assumed.

---

## Core Philosophy — This Is Not a Re-skin

> **A re-skin swaps colors and fonts. A rebrand rebuilds the UI from the show's world.**

The test: if you saw a screenshot of just one page, with no show name visible, would it
be obvious which show it belongs to? If yes, you did it right. If no, start over.

Every single design decision must answer this question:

> _"Why does this feel like [show name]?"_

### What a re-skin looks like (do not do this)

- Take the Breaking Bad card grid → paint it a different color
- Change `#62d962` → `#c8a45a` throughout
- Swap "Breaking Bad" text for the new show name
- Add a different Google Font

The result is FanHub wearing a costume. The layout, the card shapes, the interaction
patterns, the visual hierarchy — all unchanged. It still feels like the same app.

### What a real rebrand looks like

- Character cards that feel like **gang dossiers** (Peaky Blinders), **Alliance personnel files**
  (The Expanse), or **crime scene evidence boards** (True Detective)
- Episode listings styled like a **theater playbill** (Peaky Blinders), **mission briefing
  board** (Band of Brothers), or **transmission log** (Battlestar Galactica)
- A homepage hero that uses the show's **actual visual atmosphere** — foggy Birmingham streets,
  the void of space, the desert of New Mexico — expressed through CSS gradients, textures,
  and typography scale
- Navigation that looks like it was **designed inside the show's world** — not a generic
  dark navbar with an accent color

### The three layers of identity

Every rebrand must address all three layers:

| Layer          | What it means                    | Bad version           | Good version                                                                                      |
| -------------- | -------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------- |
| **Color**      | The palette derived from key art | Swap one accent color | Full palette with surface, border, danger, muted — all derived from the show's visual world       |
| **Typography** | Type as mood                     | Change one font       | Expressive display type at hero scale, tracked caps for labels, period/genre-appropriate choices  |
| **Atmosphere** | Texture, space, depth            | Dark background       | Grain overlays, vignettes, show-specific gradients, decorative motifs from the show's iconography |

### The fourth layer — LAYOUT ARCHITECTURE (most important)

> **If the HTML structure is the same, it's a re-skin. Period.**

The first three layers (color, typography, atmosphere) are CSS-only. An agent can apply
all three perfectly and STILL produce a re-skin because the DOM structure is identical:
same hero → same stats bar → same QOTD → same three card grid.

**Layout Architecture** means the page's HTML skeleton itself is different:

| Default FanHub layout                                | Re-skin (BAD)                         | New architecture (GOOD)                                                               |
| ---------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------- |
| Full-width hero → stats bar → QOTD → 3-col card grid | Same structure, different colors      | Split-panel command console with sidebar readouts                                     |
| Centered title → subtitle → two CTA buttons          | Same structure, gold instead of green | Dossier cover with folder tab, case stamp, no CTA buttons                             |
| Horizontal stats strip (6 items in a row)            | Same strip, new labels                | Vertical readout panel in a sidebar, or colophon footer, or chapter markers           |
| Three white nav cards with emoji icons               | Same cards, different emoji           | File drawer tabs, chapter entries, pinboard evidence cards, magazine departments      |
| Vertical list of episode cards                       | Same cards, different border          | Timeline with alternating entries, operations ledger table, magazine article snippets |

**The structural anti-sameness rules:**

1. **The homepage MUST NOT have the same section order** as the default (hero → stats → QOTD → cards)
2. **Navigation cards MUST NOT be a 3-4 column card grid** with emoji icons
3. **Stats MUST NOT be a horizontal strip** of identical stat-number/stat-label pairs
4. **Episode listings MUST NOT be a vertical stack of identical cards** — use timeline, table, or alternating layout
5. **Character pages MUST NOT be a simple CSS grid of cards** — use file drawer, dossier stack, masonry, or chronicle scroll
6. **The nav bar MUST have a structurally different DOM** — not just different colors on the same `<nav><brand><links>` pattern

See `references/layout-blueprints.md` for complete page-level HTML blueprints for each archetype.

---

---

## Before You Start

**Read the universe file first, then do deep visual research on the show:**

Locate the universe file (`fanhubdocs/{show}-universe.md`) — it contains the canonical show data, era, tone, characters, quotes, and structure needed for both seed data and design research.

---

## Determine Focus Language

Before starting, read the project's `AGENTS.md` (or `.github/copilot-instructions.md`)
and find the `Active implementation` line. This determines which single language track
to rebrand. Only that track's backend seed data, CSS, and frontend components are modified.

For example:

- `Active implementation: dotnet/` → only modify files under `dotnet/`
- `Active implementation: node/` → only modify files under `node/`

**Do NOT touch other language tracks.** If the user explicitly requests additional tracks,
handle them as a separate follow-up — but the default is always the single focus track.

## Clarify Before Starting

Ask if unclear; otherwise assume and proceed:

1. **Universe file** — which `fanhubdocs/*-universe.md` to use
2. **Phase** — run all phases, or start from a specific phase/step number?

---

## Phase Execution Order

| Phase       | What                                        | Key dependency                       |
| ----------- | ------------------------------------------- | ------------------------------------ |
| **Phase 0** | Visual personality research + UI design     | Universe file (show name, era, tone) |
| **Phase 1** | Seed data — focus track backend only        | Universe file                        |
| **Phase 2** | Design system + shared assets (focus track) | Phase 0 design brief                 |
| **Phase 3** | Frontend components (focus track)           | Phase 0 component designs + tokens   |
| **Phase 4** | _(skipped unless focus track uses React)_   | —                                    |
| **Phase 5** | Verification                                | All phases complete                  |

**Phase 0 must run before any visual work.** It produces the component-level design brief
that all subsequent phases implement. Skipping or rushing Phase 0 produces a re-skin, not
a rebrand. Phases 1 and 2 must complete before Phase 3.
Within each phase, steps listed as parallel can be executed simultaneously.

**Phase routing by focus language:**

| Focus track | Phase 1 seed file                          | Phase 2 CSS file                      | Phase 3 frontend | Phase 4 |
| ----------- | ------------------------------------------ | ------------------------------------- | ---------------- | ------- |
| `dotnet`    | `dotnet/Backend/Data/SeedData.cs`          | `dotnet/Frontend/wwwroot/app.css`     | Blazor (.razor)  | Skip    |
| `node`      | `node/backend/src/database/seed.sql`       | `node/frontend/src/styles/global.css` | React (.jsx)     | Skip    |
| `go`        | `go/backend/database/seed.go`              | `go/frontend/src/styles/global.css`   | React (.jsx)     | Skip    |
| `java`      | `java/backend/src/main/resources/data.sql` | `java/frontend/src/styles/global.css` | React (.jsx)     | Skip    |

---

## Phase 0 — Visual Personality Research

This phase produces a **complete design brief** — not just a color palette but a full
description of the UI experience tailored to this specific show. It has two tracks:

- **Track A** — Research (web search, key art analysis)
- **Track B** — Design decisions (translate research into concrete UI patterns)

Both tracks must complete before any code is written.

---

### Track A — Research

Run these web searches:

1. `"{show name}" TV show official poster key art color palette`
2. `"{show name}" title card typography font`
3. `"{show name}" visual aesthetic mood atmosphere`
4. `"{show name}" official website or streaming page` (for live UI reference)
5. `"{show name}" iconic imagery symbols objects` (for decorative motif candidates)
6. `"{show name}" era setting time period` (for genre-appropriate design references)

**Extract:**

| Token              | What to look for                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **Background**     | Dominant dark tone from poster/title card                                                               |
| **Accent**         | Most iconic single color in branding                                                                    |
| **Accent hover**   | Lightened ~10% variant                                                                                  |
| **Danger**         | Color associated with threat/death in key art                                                           |
| **Text**           | Primary readable text color                                                                             |
| **Text muted**     | Dimmer secondary/caption color                                                                          |
| **Display font**   | Headline font from title card — find Google Fonts equivalent                                            |
| **Body font**      | Clean readable UI font — `Inter` unless show has strong typographic identity                            |
| **Grain/texture**  | Is there a notable texture in official materials? (paper, film grain, stone, metal)                     |
| **Era/aesthetic**  | Time period and genre (e.g. "1920s industrial Birmingham", "near-future dystopian", "Gothic Victorian") |
| **Iconic objects** | 3–5 objects or symbols strongly associated with the show's visual identity                              |

---

### Track B — Show Personality Analysis

Before touching CSS, answer these questions in plain language. Write 1–2 sentences each.
This is the most important part of Phase 0.

**1. What is the emotional register of this show?**

- Dark/oppressive? Hopeful/epic? Tense/paranoid? Elegant/decadent? Chaotic/electric?
- This determines spacing, density, and pacing of the UI.

**2. What is the show's visual metaphor for power?**

- Gold coins? Cold steel? Neon light? Ancient stone? Corporate glass?
- This determines what the accent color represents and where to use it.

**3. What does the show's world feel like physically?**

- Smoky? Sterile? Humid? Arid? Airless? Candlelit?
- This determines background textures and gradient direction/style.

**4. What objects or textures are synonymous with this show?**

- Pick 3–5 objects. These become decorative motifs.
- Examples: razor blades, horse silhouettes, flatcaps (Peaky Blinders); breaking atom, hazmat suit, yellow (Breaking Bad); spacecraft, ring, alien ruins (The Expanse)

**5. What typographic tone does the show's era suggest?**

- 1920s industrial → Art Deco, heavy serifs, tracked uppercase labels
- Near-future sci-fi → Geometric sans, tight mono code-like type
- Medieval/fantasy → Old-style serif, manuscript texture
- Modern crime → Clean grotesque, newspaper column layout
- 1980s → Condensed slab, neon-colored type

---

### Track B — Show Personality → UI Language Translation

Use the answers above to make these concrete design decisions:

| Show attribute         | UI decision                                                    | Example                                                                       |
| ---------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Era/physical texture   | Background CSS: grain overlay, paper texture, or stone texture | Peaky Blinders: subtle noise grain + vignette                                 |
| Power metaphor         | Where accent color appears: borders, CTAs, or fill?            | Gold power → accent fills important buttons, amber borders on all cards       |
| Emotional register     | Spacing density                                                | Dark/oppressive → tighter spacing; epic/hopeful → more breathing room         |
| Show's typography era  | Display font choice + usage rules                              | 1920s → Playfair Display, all-caps letter-spaced section headers              |
| Iconic objects         | Decorative CSS motifs                                          | Razor blades → diagonal `clip-path` dividers; smoke → `radial-gradient` hazes |
| Physical world texture | Hero gradient style                                            | Smoky → layered radial gradients; desert → warm sand-to-black linear          |

---

### Track B — Layout Archetype Selection (CRITICAL — do not skip)

**This is the most important decision in the entire rebrand.** It determines the HTML
skeleton of every page. Without this, you get a re-skin.

Select ONE Layout Archetype from the table below based on the show's genre, era, and tone.
Then use the matching blueprints from `references/layout-blueprints.md` for ALL pages.

| Show type                      | Layout Archetype       | What it looks like                                                                                 |
| ------------------------------ | ---------------------- | -------------------------------------------------------------------------------------------------- |
| Sci-fi, military, intelligence | **Command Console**    | Split-panel dashboard with sidebar readouts, HUD corner brackets, monospaced data, asymmetric grid |
| Period crime, 1920s–1950s      | **Dossier Archive**    | Case file folder cover, tabbed file navigation, accordion file drawers, operations ledger table    |
| Fantasy, epic, mythological    | **Chronicle Codex**    | Narrow single-column narrative, illuminated drop caps, chapter numbering, ornamental dividers      |
| Modern crime, noir, thriller   | **Evidence Wall**      | Pinboard with tilted cards, red push-pins, crime scene tape headers, wiretap transcript quotes     |
| Prestige drama, literary       | **Editorial Magazine** | Masthead header, two-column feature story, pull quote sidebar, numbered department grid            |
| Dystopian, post-apocalyptic    | **Terminal Interface** | Monospaced everything, `>` command prompts, blinking cursor effects, phosphor green/amber text     |

**Write down the selected archetype name.** All Phase 3 and Phase 4 steps reference it.

**What this means concretely:**

- Home.razor gets a completely different DOM structure (not hero → stats → QOTD → cards)
- Characters.razor gets a different list/grid layout (not a simple CSS grid of cards)
- Episodes.razor gets a different presentation (not a vertical stack of identical cards)
- Quotes.razor gets a different framing (not just styled blockquotes in a list)
- NavBar.razor gets a structurally different nav pattern (not brand-left + links-right)
- The page-level grid (`grid-template-columns`, section ordering) is fundamentally different

---

### Track B — Component Aesthetic Briefs

For each FanHub component, derive a show-specific aesthetic. These are **design intentions**,
not code instructions — they tell the agent what to _build_, not just what _colors_ to use.

#### Character Cards

Ask: _What are character profiles in this show's world?_

| Show type             | Card aesthetic                         | Visual style                                                                                              |
| --------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 1920s crime gang      | **Gang dossier / police file**         | Aged border, typewriter-style mono text, case number in corner, photo area has a vignette or mugshot crop |
| Space opera           | **Alliance personnel file**            | Clean datapad aesthetic, status indicator dot, biometric-style data layout                                |
| Fantasy               | **Wanted poster / court record**       | Torn/worn edge, parchment background, heraldic accent                                                     |
| Modern crime thriller | **Case file / evidence board**         | Red thread connectors, polaroid-style photo, evidence tag                                                 |
| Period drama          | **Society page / telegraph biography** | Column layout, italic serif, ruled lines                                                                  |

#### Episode Listings

Ask: _How does this show's world announce its stories?_

| Show type          | Episode aesthetic                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------- |
| 1920s period drama | **Theater playbill** or **newspaper front page** — column layout, large headline typography |
| Sci-fi             | **Mission briefing** — monospaced header, status/classification indicators                  |
| Fantasy            | **Chronicle entry** — drop cap, scroll-like dividers                                        |
| Modern             | **Digital slate/film card** — film strip border, director credit                            |

#### Quote Display

Ask: _How do people in this show's world communicate in writing?_

| Show type      | Quote aesthetic                                                                          |
| -------------- | ---------------------------------------------------------------------------------------- |
| 1920s crime    | **Telegram** or **newspaper pull quote** — STOP. period. all-caps, or serif column quote |
| Sci-fi         | **Transmission log** — mono font, signal-noise visual noise                              |
| Fantasy        | **Illuminated manuscript** or **herald declaration** — drop cap, gold border             |
| Crime thriller | **Deposition / wiretap transcript** — case number header, redaction bars                 |

#### Hero Section (Homepage)

Ask: _If the show had an official website hero, what would it look like?_

- **Peaky Blinders**: Fog over Birmingham rooftops at dusk. Silhouette of a man in a flatcap.
  Text: "By Order of the Peaky Blinders" in stacked Playfair Display. Slow smoke drift animation.
- **The Expanse**: The void of space, a ring gate in the distance. "Humanity's Last Frontier."
  Orbitron or Space Grotesk, glitch animation on the "E" in Expanse.
- **Breaking Bad**: Desert highway vanishing point. "Change the Chemistry." Green chemical haze.
  Industrial sans, `text-shadow` glow effect on accent.

The hero is the identity statement of the site. It must be unmistakable.

---

### Phase 0 Output

Fill in `references/design-tokens.md` with all extracted values, AND write a short
"Component Aesthetic Brief" block for Characters, Episodes, Quotes, and Hero.

**Also record the selected Layout Archetype** (e.g. "Command Console", "Dossier Archive",
"Evidence Wall", etc.). This is referenced by ALL subsequent phases.

All Phase 2+ steps read from those outputs. All Phase 3+ steps use the matching
blueprints from `references/layout-blueprints.md`.

---

---

## Phase 1 — Seed Data

### Focus track backend: what to replace

Only seed the backend for the currently focused language track (determined above).
Read the universe file's data tables and map to that track's schema.

**Standard entity mapping from universe file:**

| Universe section                | Entity                  | Fields                                                                       |
| ------------------------------- | ----------------------- | ---------------------------------------------------------------------------- |
| "The Show" table                | `Show`                  | Name, Network, Genre, StartYear, EndYear, TotalSeasons, TotalEpisodes        |
| "Seasons at a Glance" table     | `Season`                | SeasonNumber, Year, EpisodeCount, AirDateStart, Description (Key Arc column) |
| "Characters" sections           | `Character`             | Name, Bio, Status, CharacterType, Tagline (if listed)                        |
| "Famous Quotes" table           | `Quote`                 | Text, CharacterName, Context                                                 |
| "Character Relationships" table | `CharacterRelationship` | Character1, Character2, RelationshipType                                     |

**Episode generation:** Universe files have season-level arcs but not per-episode titles.
Generate 6 episode titles+descriptions per season from the Key Arc and Notable Story Beats.
Use the format: `S{n}E{n}: "{Title}"` — short, evocative, in the show's tone.

**Only execute the step below that matches the focus track.** Skip the others.

#### Step 1 — Dotnet SeedData.cs (focus track: `dotnet`)

- **File**: `dotnet/Backend/Data/SeedData.cs`
- Replace all entities. Keep `admin` user seed unchanged.
- Update `CharacterImages` dictionary: keys = kebab-case character names → `/images/characters/{name}.jpg`
- After editing: delete `dotnet/Backend/fanhub.db` so the app re-seeds on next startup.
  Run `scripts/run-rebrand.ps1 -Step seed-dotnet` or do it manually.

#### Step 2 — Node seed.sql (focus track: `node`)

- **File**: `node/backend/src/database/seed.sql`
- PostgreSQL `INSERT` syntax. Node schema has extra fields: `poster_url`, `first_appearance`,
  `director`, `writer`, `rating`, `context` — populate with reasonable values.
- Populate `character_episodes` junction table.
- Preserve the intentional duplicate character bug (duplicate a main character instead of the original show's character).

#### Step 3 — Go seed.go (focus track: `go`)

- **File**: `go/backend/database/seed.go` (verify actual path before editing)
- Go/GORM syntax. Extra fields: `CreatedAt`, `UpdatedAt`, `FirstAppearance`, `Director`.

#### Step 4 — Java data.sql (focus track: `java`)

- **File**: `java/backend/src/main/resources/data.sql` (verify actual path before editing)
- JPA SQL syntax. Note: Java schema has **no Season model** — episodes reference `season_id` directly as an integer.

#### Step 5 — Character images (focus track: `dotnet`)

- **Dir**: `dotnet/Frontend/wwwroot/images/characters/`
- _(For non-dotnet focus tracks, locate the equivalent images directory.)_
- Delete all existing `*.jpg` files.
- Create SVG placeholder for each character: dark `--color-surface` background, `--color-accent` large initial,
  character name in small text. Name files `{kebab-case-name}.jpg` (keep `.jpg` extension for
  compatibility with `CharacterImages` dictionary).
- See `references/svg-placeholder-template.md` for the SVG pattern.

---

## Phase 2 — Design System

Phase 2 is not "apply the color tokens." It is **build the visual language of the show
in CSS** — then apply it. Color tokens are the smallest part of this phase.

### Step 6 — The full CSS design system

Create a design system in `dotnet/Frontend/wwwroot/app.css` that contains all four layers.
CSS patterns and code for each layer are in `references/css-patterns.md`.

#### 2a — Color tokens

Apply the full `:root {}` token set from `references/design-tokens.md` → "Token Set (CSS)".
These are the only values in the codebase that should reference show-specific colors.
All components consume tokens; no hex values anywhere outside `:root`.

#### 2b — Atmosphere layer

This is what creates a non-generic feel. Choose ONE or more based on the show's physical world:

| Show physical world        | Atmosphere technique                  |
| -------------------------- | ------------------------------------- |
| Smoke, coal dust, fog      | Film grain overlay + radial vignette  |
| Deep space, void           | Subtle dark gradient only — no grain  |
| Rain-slicked streets, neon | Scanline overlay + neon radial blooms |
| Arid/desert                | Warm linear gradient, no overlay      |
| Period/candlelit interior  | Grain overlay only                    |
| Medieval stone             | Vignette only                         |

See `references/css-patterns.md` → "Atmosphere Layer" for the CSS for each technique.
See `references/css-patterns.md` → "Hero Gradients" for show-specific `.hero` background CSS.

#### 2c — Show-specific decorative system

Based on the iconic objects from Phase 0, pick 2–3 decorative CSS patterns. Do not use all of them.

| Iconic object / show type             | Decorative pattern          |
| ------------------------------------- | --------------------------- |
| Razor blades, weapons                 | Diagonal blade divider      |
| Police files, telegrams               | Accent side rule (doc-rule) |
| Evidence files, intelligence dossiers | Corner bracket decoration   |
| Fantasy/heraldic                      | Horizontal rule with glyph  |
| Sci-fi, classified documents          | Mono scan line rule         |

See `references/css-patterns.md` → "Decorative System" for CSS for each pattern.

#### 2d — Typography scale

Typography must be **expressive**, not just functional. Adjust letter-spacing and text-transform
based on the show's era (Period → tracked uppercase; Sci-fi → tracked uppercase; Modern → tight, title-case).

See `references/css-patterns.md` → "Typography Scale" for the `.text-hero`, `.text-section`,
`.text-label`, and `.text-quote` CSS classes.

#### 2e — Card language

Cards must feel show-specific. Choose the card style that matches the Component Aesthetic Brief:

| Component brief type       | Card class         | Use for                               |
| -------------------------- | ------------------ | ------------------------------------- |
| Gang dossier / police file | `.card-dossier`    | Period crime, gritty shows            |
| Alliance personnel file    | `.card-file`       | Sci-fi, military, modern intelligence |
| Theater playbill           | `.card-playbill`   | Period entertainment, theatrical      |
| Broadsheet / chronicle     | `.card-broadsheet` | Journalism, crime, newspaper-adjacent |

See `references/css-patterns.md` → "Card Language" for CSS for each card type.
See `references/css-patterns.md` → "Status Badges" for `.badge-alive` / `.badge-deceased`.

### Step 7 — CSS + font links (focus track)

**If focus track is `dotnet`:**

- **`dotnet/Frontend/wwwroot/app.css`**: Apply the full design system from Step 6.
  Delete ALL previous show's color values. Apply the atmosphere layer. Apply the
  decorative system. Apply typography scale.
- **`dotnet/Frontend/Components/App.razor`**: Add Google Fonts `<link>` tags before
  `<ResourcePreloader />` using the font names from Phase 0:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family={DisplayFont}:wght@700;900&family={BodyFont}:wght@400;500;600&display=swap"
    rel="stylesheet"
  />
  ```

**If focus track is `node`, `go`, or `java`:**

- **`{track}/frontend/src/styles/global.css`**: Same full design system as above.
- **`{track}/frontend/public/index.html`**: Google Fonts link, `<title>` → `{Show Name} - FanHub`.

---

## Phase 3 — Frontend Components (Focus Track)

**Phase 3 applies to the focus track's frontend only.**

- If focus track is `dotnet` → edit Blazor `.razor` files (steps 9–15c below).
- If focus track is `node`, `go`, or `java` → edit React `.jsx` / `.js` files. Use the
  same design intentions described in steps 9–15c but apply them to the React component
  equivalents (Header.jsx, Footer.js, Home.jsx, Characters.jsx, Episodes.js, etc.).

**The golden rule for Phase 3:** Every page must be **written from scratch** using the
Layout Archetype's blueprint from `references/layout-blueprints.md`. You are NOT editing
the old page — you are replacing the entire file with a new page built from the blueprint.

**DO NOT:**

- Keep the old DOM structure and just change CSS classes
- Keep `hero → stats bar → QOTD → nav cards` section ordering from the default layout
- Keep the 3-column card grid with emoji icons as navigation
- Keep the horizontal stats strip
- Keep `<div class="hero">...<div class="hero-content">` wrapper pattern

**DO:**

- Open the matching blueprint in `references/layout-blueprints.md`
- Copy the entire page structure for the selected Layout Archetype
- Replace placeholder text with actual show data from the universe file
- Apply CSS from `references/css-patterns.md` on top of the blueprint's CSS
- The result must have a fundamentally different DOM tree than the previous show

Work steps 9–10 first (layout shell), then 11–15 in parallel.

### Step 9 — NavBar.razor

**Use the Navigation Blueprint** from `references/layout-blueprints.md` matching the
selected Layout Archetype. The nav bar MUST have a different DOM structure — not just
different colors on the same `<nav><brand><links>` pattern.

| Archetype          | Nav pattern                                         | Key structural difference                      |
| ------------------ | --------------------------------------------------- | ---------------------------------------------- |
| Command Console    | Status indicator bar with monospaced items          | Has a system status dot and "ONLINE" label     |
| Dossier Archive    | Manila folder tabs                                  | Tabs look like physical file cabinet tabs      |
| Chronicle Codex    | Ornamental nav with glyph dividers between items    | Decorative `✦` separators, no hover underlines |
| Evidence Wall      | Minimal with crime scene tape accent                | Tape-strip brand treatment                     |
| Editorial Magazine | Split masthead nav — brand centered, links on sides | Links split left/right of centered brand name  |

**Implement:**

- Replace the ENTIRE NavBar.razor file content with the blueprint's nav structure
- Adapt text/links to match the show's terminology from universe file
- The nav must look structurally different from the previous show's nav — not just recolored

### Step 10 — MainLayout.razor + MainLayout.razor.css

**Design question first:** What is the _frame_ of this show's world?

**`MainLayout.razor`:**

- Footer: dark, show-appropriate tagline (derive from universe file famous quotes or premise).
- Accent-colored separator line between content and footer.
- The tagline must be an actual line from the show or a direct reference — not generic.

**`MainLayout.razor.css`:**

- `.sidebar`: `background: var(--color-bg)` — no gradients from other shows.
- `.top-row`: `background-color: var(--color-bg)`.
- `#blazor-error-ui`: `background: var(--color-error-bg)`, border color = `var(--color-danger)`.
- `color-scheme: dark`.

### Step 11 — Home.razor

**This is the single most important page.** Replace the ENTIRE file with the Home Page
Blueprint from `references/layout-blueprints.md` matching the selected Layout Archetype.

**STRUCTURAL REQUIREMENTS — the new Home.razor MUST:**

1. Have a **completely different grid layout** than the default `hero → stats → QOTD → cards`.
   Each archetype specifies a different grid:
   - Command Console: `grid-template-columns: 280px 1fr 240px` (3-panel dashboard)
   - Dossier Archive: folder cover → case brief (2-col stats+desc) → intercepted comm → file tabs
   - Chronicle Codex: single narrow column, max-width 800px, vertical scroll narrative
   - Evidence Wall: case header → 3-column pinboard with tilted cards
   - Editorial Magazine: masthead → 2-col feature story → 4-col department grid

2. **Stats must NOT be a horizontal strip.** They must be integrated into the layout:
   - Command Console: readout grid in the left sidebar panel
   - Dossier Archive: vertical stats in the case brief sidebar
   - Chronicle Codex: horizontal colophon footer with ornamental dividers
   - Evidence Wall: inline case metadata footer
   - Editorial Magazine: masthead subhead and colophon footer

3. **QOTD must NOT be a centered blockquote section.** It must be integrated:
   - Command Console: transmission log in the left sidebar
   - Dossier Archive: intercepted communication with timestamp
   - Chronicle Codex: oracle speech section with decorative rune dividers
   - Evidence Wall: pinned wiretap card on the pinboard
   - Editorial Magazine: pull quote in the feature story sidebar

4. **Navigation must NOT be emoji-icon cards.** Use the archetype's pattern:
   - Command Console: sidebar nav items with `▸` indicators and counts
   - Dossier Archive: file tabs with pull-to-open aesthetics
   - Chronicle Codex: chapter entries with roman numerals
   - Evidence Wall: pinned evidence cards with red pins
   - Editorial Magazine: numbered department grid with vertical dividers

**Implementation:**

- Delete the ENTIRE existing Home.razor content
- Copy the matching Home Page Blueprint from `references/layout-blueprints.md`
- Replace all placeholder text: `{Show Name}`, `{Tagline}`, `{Show description}`, counts
- Add the `@code` block with the same data-loading logic (characterCount, quoteCount, etc.)
- Add the `<style>` block with the blueprint's CSS
- The result must be unrecognizable as the same app when compared to the previous show

### Step 12 — Characters.razor

**Use the Characters Page Blueprint** from `references/layout-blueprints.md`.

**STRUCTURAL REQUIREMENTS — the characters page MUST NOT be a simple CSS grid of cards.**

| Archetype          | Characters layout                                           | Key structural difference                                |
| ------------------ | ----------------------------------------------------------- | -------------------------------------------------------- |
| Command Console    | Two-column: filter sidebar + personnel grid                 | Sidebar has toggle filter buttons, not a dropdown        |
| Dossier Archive    | Vertical file drawer — stacked entries that expand on click | Accordion-style, not a grid                              |
| Chronicle Codex    | Single-column narrative scroll with portraits               | Each character is an "article" with sidebar portrait     |
| Evidence Wall      | 3-column pinboard with tilted suspect cards                 | Cards have red pins and slight rotation                  |
| Editorial Magazine | Feature article layout with large lead character            | First character is a "feature", rest are compact entries |

**Implementation:**

- Replace the ENTIRE Characters.razor file with the blueprint's structure
- Keep the same `@code` block logic (data loading, character selection, detail modal)
- Apply the Component Aesthetic Brief's card style within the new layout structure
- Status badges: Alive → accent, Deceased → danger (`.badge-alive`, `.badge-deceased`)

### Step 13 — Episodes.razor

**Use the Episodes Page Blueprint** from `references/layout-blueprints.md`.

**STRUCTURAL REQUIREMENTS — episodes MUST NOT be a vertical stack of identical cards.**

| Archetype          | Episodes layout                                            | Key structural difference                             |
| ------------------ | ---------------------------------------------------------- | ----------------------------------------------------- |
| Command Console    | Vertical timeline with alternating left/right entries      | Timeline axis with dot nodes                          |
| Dossier Archive    | Operations ledger table — dense, no cards                  | Actual `<table>` with ref/title/briefing/date columns |
| Chronicle Codex    | Chapter entries with drop caps and ornamental dividers     | Each episode is a narrative passage                   |
| Evidence Wall      | Pinboard with scattered event cards                        | Tilted cards with red pins                            |
| Editorial Magazine | Article snippets with large headlines and horizontal rules | Each episode is a magazine article entry              |

Season filter:

- Max seasons must match universe file's total seasons exactly
- Filter control style must match the archetype (toggle buttons for Console, tabs for Dossier, dropdown for Magazine)
- Label: "Filter by Series:" for British shows, "Filter by Season:" for American

### Step 14 — Quotes.razor

**Use the Quotes Page Blueprint** from `references/layout-blueprints.md`.

**STRUCTURAL REQUIREMENTS — quotes MUST NOT be a plain list of styled blockquotes.**

| Archetype          | Quotes layout                                    | Key structural difference                       |
| ------------------ | ------------------------------------------------ | ----------------------------------------------- |
| Command Console    | Transmission feed with signal indicators         | Vertical feed with `▮▮▮▯▯` signal strength bars |
| Dossier Archive    | Intercepted communications with wiretap headers  | Each quote is a transcript document             |
| Chronicle Codex    | Oracle speeches with illuminated drop-cap quotes | Centered, decorative, with rune dividers        |
| Evidence Wall      | Transcript wall — pinned wiretap cards           | Tilted cards on a pinboard                      |
| Editorial Magazine | Pull quotes with large editorial typography      | Two-column with quotes as featured excerpts     |

Quote text should use the display font at a large scale (`1.4rem+`), with show-appropriate
framing (not just a dark card with italic text).

### Step 15 — Locations.razor (if implemented)

Apply the same Component Aesthetic Brief logic:

- Location cards follow the same card language as Characters/Episodes.
- Location "type" tags styled consistently with the show's label style.
- Show-appropriate subtitle referencing the show's world, not "FanHub · {ShowName}".

### Step 15a — NavMenu.razor / NavMenu.razor.css

- Remove vestigial Blazor template links (Counter, Weather).
- `.nav-item ::deep a.active`: replace `rgba(255,255,255,0.37)` → `var(--color-accent-muted)`,
  add `border-left: 3px solid var(--color-accent)`.
- Hover: replace `rgba(255,255,255,0.1)` → `rgba({accent-rgb}, 0.08)`.

### Step 15b — NotFound.razor

- Large display-font `404` in accent color.
- Show-appropriate tagline (an in-universe phrase from the Famous Quotes or show premise).
- "Return Home" CTA in show-appropriate phrasing (e.g. "Return to Small Heath →" for PB).
- Dark background, no Bootstrap defaults.

### Step 15c — Error.razor

- Dark error page, show-appropriate tone.
- Preserve the `@code` block (`ShowRequestId`, `RequestId`, `OnInitialized`).
- Show the request ID in the show's label style.
- No Bootstrap `text-danger` classes.

---

---

## Phase 4 — SKIP

> **Phase 4 is not used.** All frontend work is handled in Phase 3 for whichever single
> track is the focus language. There is no cross-track copying step.
>
> If the focus track is React-based (node/go/java), Phase 3 already covers those React
> components directly. The steps below are retained as reference only for the React
> component equivalents but should NOT be executed as a separate phase.

<details>
<summary>React component reference (informational only)</summary>

### Step 16 — Header.jsx

Same design logic as NavBar.razor — show-appropriate nav aesthetic, display font for brand,
accent-colored active indicator. Do not replicate the BB default dark navbar.

### Step 17 — Footer.js

Same footer design as MainLayout.razor — dark, show tagline, accent separator line.

### Step 18 — Home.jsx

Same cinematic hero as Home.razor — layered gradient, large display-font title, show tagline,
stats, show-appropriate nav cards using the card aesthetic from Phase 0.

### Step 19 — Characters.jsx + CharacterCard.jsx

Apply the component aesthetic brief for character cards. CharacterCard.jsx is the component
to redesign — it should use the same dossier/file/playbill aesthetic as Blazor.

### Step 20 — Episodes.js + EpisodeList.js

Apply the episode aesthetic brief. Season count to match universe file.

### Step 21 — About.jsx

Update show name references, show-appropriate description from universe file.

### Step 22 — QuoteDisplay.jsx + QuoteDisplay.module.css

Apply the quote aesthetic brief. Large display-font quote text, show-appropriate framing.

### Step 23–24 — global.css + index.html

- `node/frontend/src/styles/global.css`: Full design system from Phase 2 Step 6.
- `node/frontend/public/index.html`: Google Fonts link, updated `<title>`.

### Step 25 — Copy to go/ and java/

Copy all modified files. Preserve `package.json` differences in each track.

</details>

---

## Phase 5 — Verification

### Step 26 — Build verification loop (REQUIRED before any visual check)

**Do NOT use `start.ps1` as a build check.** It masks errors behind a combined output and
restarts on failure in ways that make errors hard to isolate. Build the focus track's
backend and frontend separately, read all error output, fix every error, and repeat until
both pass cleanly.

**Build commands depend on the focus track:**

| Focus track | Backend build                          | Frontend build                          |
| ----------- | -------------------------------------- | --------------------------------------- |
| `dotnet`    | `cd dotnet/Backend; dotnet build 2>&1` | `cd dotnet/Frontend; dotnet build 2>&1` |
| `node`      | `cd node/backend; npm run build 2>&1`  | `cd node/frontend; npm run build 2>&1`  |
| `go`        | `cd go/backend; go build ./... 2>&1`   | `cd go/frontend; npm run build 2>&1`    |
| `java`      | `cd java/backend; ./mvnw compile 2>&1` | `cd java/frontend; npm run build 2>&1`  |

#### Build loop (dotnet example) — run until zero errors

```powershell
# From repo root
cd dotnet/Backend
dotnet build 2>&1

cd ../Frontend
dotnet build 2>&1
```

**Repeat this loop until both commands exit with `Build succeeded` and zero errors/warnings.**

#### How to interpret build output

| Output pattern                                 | Meaning                                                         | Action                                            |
| ---------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------- |
| `error CS0102: already contains a definition`  | New `@code` block prepended to old — file has duplicate content | Truncate old half; see "Duplicate Content" below  |
| `error CS8954: only one file-scoped namespace` | New class prepended to old in a `.cs` file                      | Truncate old half                                 |
| `error RZ9980: Unclosed tag`                   | New Razor markup prepended to old — file has duplicate HTML     | Truncate old half                                 |
| `error CS0111: already defines a member`       | Duplicate method in `@code` block                               | Truncate old half                                 |
| `error CS0246: type not found`                 | Missing `using` or wrong model class name                       | Add the missing `using` or fix the type reference |
| `error CS1002: ; expected`                     | Syntax error in C# — usually inside `@code`                     | Read the line; fix the syntax                     |
| `warning RZ10012`                              | Unrecognized HTML attribute — usually fine in Blazor            | Ignore unless it escalates to error               |

#### Diagnosing and fixing duplicate content

Duplicate content errors (CS0102, CS8954, RZ9980, CS0111) always mean **new content was
prepended to the old file** instead of replacing it. The fix is always the same:

1. Find where the old content begins:

   ```powershell
   # For .cs files — find duplicate namespace declarations
   (Get-Content path/to/File.cs | Select-String "^namespace " -AllMatches).LineNumber

   # For .razor files — find duplicate @page directives or @code blocks
   (Get-Content path/to/Page.razor | Select-String "^@page |^@code" -AllMatches).LineNumber
   ```

2. Identify the split line — the **second** occurrence of the namespace/`@page`/`@code` directive.
   Everything from that line to the end of the file is old content to remove.

3. Truncate — keep only lines **before** the split point (subtract ~3 blank lines):

   ```powershell
   $lines = Get-Content path/to/File.cs
   # e.g. second namespace starts at line 236 → keep lines 0..232 (0-indexed)
   $lines[0..232] | Set-Content path/to/File.cs -Encoding UTF8
   ```

4. Verify the file ends correctly — last lines should be `    }` then `}` (closing the class and namespace):

   ```powershell
   (Get-Content path/to/File.cs)[-5..-1]
   ```

5. Re-run `dotnet build` in that project. If errors persist, read the new output carefully
   and address each remaining error before running again.

#### Common post-truncation issues

- **`using Backend.Data;` self-reference in SeedData.cs** — Remove it; the class is _inside_
  that namespace, so it cannot import itself.
- **`@page` directive missing** — The truncation point was too early; move it forward by
  checking the actual line content rather than guessing by line count.
- **Model class not found** — The new file references a model type from the old show's
  namespace. Replace with the correct type from `dotnet/Backend/Models/`.

#### Reset DB after build succeeds (dotnet only)

If focus track is `dotnet`, reset the database so it re-seeds with new data on next run:

```powershell
Remove-Item "dotnet/Backend/fanhub.db" -ErrorAction SilentlyContinue
Remove-Item "dotnet/Backend/fanhub.db-wal" -ErrorAction SilentlyContinue
Remove-Item "dotnet/Backend/fanhub.db-shm" -ErrorAction SilentlyContinue
```

### Step 27 — Visual check (focus track)

Start the focus track's app and verify:

- `/` — cinematic hero, show-specific atmosphere, large display-font title, show tagline
- `/characters` — correct characters with show-specific card aesthetic (dossier/file/playbill)
- `/episodes` — correct season count, show-specific episode card aesthetic
- `/quotes` — show quotes with show-specific framing (telegram/transmission/etc.)
- Responsive at mobile widths
- **The identity test:** could you tell which show this is from a screenshot alone, with no show name visible?

### Step 28 — API spot check (focus track)

Verify the focus track's API returns correct data:

```
GET /api/shows        → new show name
GET /api/characters   → correct character list
GET /api/episodes?season=1 → correct episode count per season
GET /api/quotes       → new show quotes
```

### Step 29 — ~~React spot check~~ (SKIP)

> Step 29 is skipped. Only the focus track is verified. No cross-track comparison needed.

---

## Completion Checklist

### Phase 0

- [ ] Visual personality analysis complete (emotional register, power metaphor, physical world, iconic objects, typographic tone)
- [ ] Show Personality → UI Language translation decisions recorded
- [ ] Component Aesthetic Briefs written for Characters, Episodes, Quotes, and Hero
- [ ] **Layout Archetype selected** (Command Console / Dossier Archive / Chronicle Codex / Evidence Wall / Editorial Magazine)
- [ ] Color palette researched from key art
- [ ] Display font + body font identified and verified on Google Fonts
- [ ] `references/design-tokens.md` filled in with all values

### Phase 1

- [ ] Universe file read; all entity data extracted
- [ ] Focus track backend seeded with show-specific data
- [ ] Correct total seasons and episodes
- [ ] Character images updated (SVG placeholders or actual images)
- [ ] Duplicate character bug preserved with new show character
- [ ] DB deleted and app re-seeds on startup (if applicable)

### Phase 2

- [ ] Full CSS design system implemented (not just color tokens)
- [ ] Atmosphere layer added (grain, vignette, or show-specific texture)
- [ ] Show-specific hero gradient implemented (not generic dark)
- [ ] Decorative motif system added (at least 1 from Phase 0 iconic objects)
- [ ] Typography scale implemented (hero text at 3–7rem, tracked labels, expressive section headers)
- [ ] Show-appropriate card language defined and implemented
- [ ] All previous show colors removed (no `#62d962`, `#2a8c2a`, `#fafafa`, `#f7f7f7`, `lightyellow`, blue sidebar gradient)
- [ ] Google Fonts loaded

### Phase 5 — Build Verification

- [ ] Focus track backend builds with zero errors
- [ ] Focus track frontend builds with zero errors
- [ ] Both commands re-run after every fix until clean
- [ ] No duplicate content errors in either project
- [ ] DB deleted after successful builds (if applicable)

### Phase 3

- [ ] Navigation: **structurally different DOM** (verify against layout blueprint)
- [ ] Footer: actual show tagline, not placeholder text
- [ ] Layout styles: previous show gradients and light backgrounds removed
- [ ] Home page: **completely different page layout** from default
- [ ] Home page: stats are NOT a horizontal strip
- [ ] Home page: QOTD is NOT a centered blockquote section
- [ ] Home page: navigation is NOT emoji-icon cards in a grid
- [ ] Characters page: **different list/grid pattern**
- [ ] Characters page: Component Aesthetic Brief implemented
- [ ] Episodes page: **different presentation** — not identical stacked cards
- [ ] Episodes page: correct season count from universe file
- [ ] Quotes page: **different framing** — not plain styled blockquotes
- [ ] Error/404 pages: show-specific, no framework defaults

### Phase 4

- [ ] ~~Phase 4 skipped~~ — only the focus track is rebranded

### The identity test (required)

- [ ] **A screenshot of any single page, with show name text removed, is immediately recognizable as belonging to this specific show.**
- [ ] **The page layout structure (DOM tree) is fundamentally different from the previous show.** Compare: different grid-template-columns, different section ordering, different navigation pattern, different stats presentation, different content grouping.
- [ ] **If you swapped only the CSS (colors/fonts) back to the previous show, the pages would STILL look different** because the HTML structure itself changed.

---

## References

- `references/layout-blueprints.md` — **CRITICAL** — full-page HTML blueprints for each Layout Archetype (Command Console, Dossier Archive, Chronicle Codex, Evidence Wall, Editorial Magazine). Includes Home, Characters, Episodes, Quotes, and Navigation blueprints with complete CSS.
- `references/design-tokens.md` — color token set, personality analysis template, UI language translation, Component Aesthetic Briefs
- `references/css-patterns.md` — all CSS patterns (atmosphere, decorative, typography, card language, status badges)
- `references/component-patterns.md` — Blazor and React markup templates for Characters, Episodes, and Quotes card-level patterns
- `references/svg-placeholder-template.md` — SVG character placeholder pattern
- `scripts/run-rebrand.ps1` — helper script (stop server, delete DB, restart)
