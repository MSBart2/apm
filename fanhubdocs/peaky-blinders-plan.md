# Plan: Peaky Blinders Full Rebrand

## TL;DR

Replace all Breaking Bad content and green-on-black FanHub UI with a fully Peaky Blinders-branded experience across all 4 language tracks. New seed data from `peaky-blinders-universe.md`, new design system (dark industrial Birmingham aesthetic with amber/gold accents), new character images, and a modern responsive UI.

---

## Phase 1 — Seed Data (all 4 backends)

All seed data comes from `peaky-blinders-universe.md`. Replace Breaking Bad → Peaky Blinders.

### Step 1: Dotnet `SeedData.cs`

- **File**: `dotnet/Backend/Data/SeedData.cs`
- Replace the Show: "Peaky Blinders", BBC, Historical Crime Drama, 2013–2022, 6 seasons, 36 episodes
- Replace Seasons: 6 seasons (6 eps each) with air dates from the reference doc
- Replace Episodes: 36 episodes across 6 seasons. The reference doc has season-level summaries — generate episode titles/descriptions from the Key Arc info per season (e.g. S1: "Stolen Guns", "The Garrison", "Billy Kimber", "Inspector Campbell", "Grace Burgess", "The Epsom Plan")
- Replace Characters: ~12 characters from the doc — Tommy Shelby, Arthur Shelby Jr., Polly Gray, Ada Thorne, John Shelby, Finn Shelby, Alfie Solomons, Grace Shelby, Inspector Campbell, Michael Gray, Luca Changretta, Oswald Mosley. Use Bio/Status/Tagline/CharacterType from the doc.
- Replace Quotes: Use the Famous Quotes table from the doc (~15 quotes with character + context attribution)
- Replace CharacterRelationships: Use the Character Relationships table from the doc
- Update `CharacterImages` dictionary keys to Peaky Blinders character names → `/images/characters/tommy-shelby.jpg` etc.
- Keep admin user seed unchanged

### Step 2: Node `seed.sql`

- **File**: `node/backend/src/database/seed.sql`
- Same Peaky Blinders data adapted to PostgreSQL INSERT syntax
- Map fields to Node schema (has extra fields: `poster_url`, `first_appearance`, `director`, `writer`, `rating`, `context`)
- Populate `character_episodes` junction table
- Keep the intentional duplicate character bug pattern (duplicate Tommy or Arthur instead of Jesse)

### Step 3: Go seed data

- **File**: `go/backend/database/seed.go` (verify exact path)
- Same Peaky Blinders data adapted to Go/GORM syntax
- Map fields to Go models (has `CreatedAt`/`UpdatedAt`, `FirstAppearance`, `Director`, etc.)

### Step 4: Java seed data

- **File**: `java/backend/src/main/resources/data.sql` (verify exact path)
- Same Peaky Blinders data adapted to Java/JPA
- Note: Java has no Season model — episodes reference season_id directly

### Step 5: Delete old character images, add placeholder Peaky Blinders images

- **Dir**: `dotnet/Frontend/wwwroot/images/characters/`
- Remove all `*.jpg` Breaking Bad actor photos
- Add SVG-based initial placeholders for ~12 Peaky Blinders characters (dark bg + amber text)
- Update `download.ps1` if it exists

_Steps 1–4 are parallel. Step 5 depends on Step 1 (need final character list)._

---

## Phase 2 — Design System & Shared Assets

### Step 6: Design tokens (reference — not a file change)

Design language inspired by 1920s industrial Birmingham:

- **Primary palette**: Rich black `#0a0a0a`, charcoal `#1a1a1a`, smoke `#2a2a2a`
- **Accent**: Amber/gold `#c8a45a` (whiskey/brass), secondary warm amber `#d4a843`
- **Danger/blood**: Deep crimson `#8b1a1a`
- **Text**: Off-white `#e8e0d0` (parchment tone), muted `#a09880`
- **Typography**: `Playfair Display` for headings (serif), `Inter` for body (sans-serif)
- **Visual motifs**: Razor blade dividers, flat cap references, smoke/fog gradients, industrial textures
- **Borders**: `border-bottom: 2px solid #c8a45a` replaces all `#62d962` green accents
- **Cards**: Dark cards (`#1a1a1a`) with amber top-border, subtle shadow, no white backgrounds
- **Buttons**: Amber fill with dark text (primary), outlined amber (secondary)

### Step 7: Update dotnet `app.css` and font imports

- **File**: `dotnet/Frontend/wwwroot/app.css` — CSS custom properties, dark body, amber links, serif headings
- **File**: `dotnet/Frontend/Components/App.razor` — add Google Font `<link>` tags (Playfair Display + Inter)

### Step 8: Update React `global.css` and font imports

- **Files**: `node/frontend/src/styles/global.css` (copy to go/java after)
- **Files**: `node/frontend/public/index.html` (copy to go/java after) — Google Font links, update `<title>`

_Steps 7–8 are parallel._

---

## Phase 3 — Dotnet Blazor Frontend (complete UI overhaul)

### Step 9: NavBar.razor — Peaky Blinders branding

- **File**: `dotnet/Frontend/Components/Layout/NavBar.razor`
- Replace "FanHub" logo with "Peaky Blinders" or "The Shelby Company" stylized serif text
- Dark nav background with amber accent border
- Nav links: Home, Characters, Episodes, Quotes
- Active link indicator: amber underline

### Step 10: MainLayout.razor — Footer rebrand

- **File**: `dotnet/Frontend/Components/Layout/MainLayout.razor`
- Dark footer, amber accent, "By Order of the Peaky Blinders" tagline

### Step 11: Home.razor — Cinematic hero & landing page

- **File**: `dotnet/Frontend/Components/Pages/Home.razor`
- **Hero**: Full-viewport dark cinematic section, "PEAKY BLINDERS" in large Playfair Display, smoke gradient, tagline, amber CTA buttons
- **Stats**: Dark cards — 6 Seasons, character count, 36 Episodes, BBC
- **Quote of the Day**: Dark parchment-style card, serif text, amber left border
- **Nav cards**: Characters (🎩) + Episodes (📺), dark cards with amber top borders

### Step 12: Characters.razor — Dark grid & detail modal

- **File**: `dotnet/Frontend/Components/Pages/Characters.razor`
- Dark page, dark character cards with amber top border
- Status badges: "alive" → amber, "deceased" → crimson
- Detail modal: dark overlay, amber-bordered, full bio, tagline, relationships

### Step 13: Episodes.razor — Dark season guide

- **File**: `dotnet/Frontend/Components/Pages/Episodes.razor`
- Dark theme, amber season filter pills/dropdown
- Episode cards: dark bg, amber left border, air date muted

### Step 14: Quotes.razor — New page

- **File**: `dotnet/Frontend/Components/Pages/Quotes.razor` (**create new**)
- Editorial layout: large serif quote text, character attribution, context
- Amber like button, dark cards
- Add route to NavBar (Step 9)

### Step 15: Favicon and static assets

- **File**: `dotnet/Frontend/wwwroot/favicon.png` — replace with amber/gold icon

_Steps 9–10 first (layout), then 11–14 in parallel. Step 15 independent._

---

## Phase 4 — React Frontends (node/go/java — all identical source)

Changes made once in `node/frontend/`, then copied to `go/frontend/` and `java/frontend/`.

### Step 16: Header.jsx — Nav rebrand

- **File**: `node/frontend/src/components/Header.jsx`
- Same Peaky Blinders branding as dotnet NavBar: dark bg, amber accents, serif logo

### Step 17: Footer.js — Rebrand

- **File**: `node/frontend/src/components/Footer.js`
- Dark footer, amber accent, "By Order of the Peaky Blinders"

### Step 18: Home.jsx — Hero & landing

- **File**: `node/frontend/src/pages/Home.jsx`
- Same cinematic hero design, stats, QOTD, nav cards

### Step 19: Characters.jsx + CharacterCard.jsx — Dark grid

- **Files**: `node/frontend/src/pages/Characters.jsx`, `node/frontend/src/components/CharacterCard.jsx`
- Dark theme, amber accents, same card design as dotnet

### Step 20: Episodes.js + EpisodeList.js — Dark season guide

- **Files**: `node/frontend/src/pages/Episodes.js`, `node/frontend/src/components/EpisodeList.js`
- Dark theme, amber season buttons, dark episode cards

### Step 21: About.jsx — Content update

- **File**: `node/frontend/src/pages/About.jsx`
- Reference Peaky Blinders instead of Breaking Bad, dark theme

### Step 22: QuoteDisplay.jsx + CSS Module

- **Files**: `node/frontend/src/components/QuoteDisplay.jsx`, `node/frontend/src/styles/QuoteDisplay.module.css`
- Dark card, serif quote, amber like button

### Step 23: global.css — Dark theme base

- **File**: `node/frontend/src/styles/global.css`
- Dark body background, amber links, serif headings

### Step 24: index.html — Fonts & title

- **File**: `node/frontend/public/index.html`
- Google Font links, `<title>` → "Peaky Blinders - FanHub"

### Step 25: Copy all changes to go/ and java/

- Copy all modified files from `node/frontend/` to `go/frontend/` and `java/frontend/`
- Preserve `package.json` differences (name, proxy fields)

_Do Steps 23–24 first (base), then 16–17 (layout), then 18–22 (pages) in parallel. Step 25 after all._

---

## Phase 5 — Verification

### Step 26: Delete stale DB and restart dotnet

- Delete `dotnet/Backend/fanhub.db`
- Run `dotnet/start.ps1`
- Verify backend seeds Peaky Blinders data, frontend renders

### Step 27: Visual verification (dotnet @ localhost:3000)

- `/` — dark hero with "PEAKY BLINDERS", amber accents, stats, QOTD
- `/characters` — Tommy, Arthur, Polly etc. with correct bios, status badges
- `/episodes` — 6 seasons, 36 episodes, season filter works
- `/quotes` — quotes display with character attribution
- Responsive check at mobile widths

### Step 28: API verification

- `GET /api/shows` → Peaky Blinders
- `GET /api/characters` → Tommy, Arthur, Polly...
- `GET /api/episodes?season=1` → 6 S1 episodes
- `GET /api/quotes` → Peaky Blinders quotes

### Step 29: React spot check

- Start node track, verify React frontend shows Peaky Blinders branding
- Verify go/java frontends match

---

## Relevant Files

### Seed Data (modify)

- `dotnet/Backend/Data/SeedData.cs` — C# seed, all entities
- `node/backend/src/database/seed.sql` — PostgreSQL seed
- `go/backend/database/seed.go` — Go/GORM seed (verify path)
- `java/backend/src/main/resources/data.sql` — JPA seed (verify path)

### Character Images (replace)

- `dotnet/Frontend/wwwroot/images/characters/*.jpg` — delete BB, add PB placeholders

### Dotnet Frontend (modify all)

- `dotnet/Frontend/wwwroot/app.css` — design tokens
- `dotnet/Frontend/Components/App.razor` — font imports
- `dotnet/Frontend/Components/Layout/NavBar.razor` — nav rebrand
- `dotnet/Frontend/Components/Layout/MainLayout.razor` — footer
- `dotnet/Frontend/Components/Pages/Home.razor` — hero + landing
- `dotnet/Frontend/Components/Pages/Characters.razor` — dark grid
- `dotnet/Frontend/Components/Pages/Episodes.razor` — dark season guide
- `dotnet/Frontend/Components/Pages/Quotes.razor` — **new file**
- `dotnet/Frontend/wwwroot/favicon.png` — new icon

### React Frontends (modify in node/, copy to go/ and java/)

- `node/frontend/public/index.html`
- `node/frontend/src/styles/global.css`
- `node/frontend/src/styles/QuoteDisplay.module.css`
- `node/frontend/src/components/Header.jsx`
- `node/frontend/src/components/Footer.js`
- `node/frontend/src/components/CharacterCard.jsx`
- `node/frontend/src/components/EpisodeList.js`
- `node/frontend/src/components/QuoteDisplay.jsx`
- `node/frontend/src/pages/Home.jsx`
- `node/frontend/src/pages/Characters.jsx`
- `node/frontend/src/pages/Episodes.js`
- `node/frontend/src/pages/About.jsx`

### Reference

- `peaky-blinders-universe.md` — canonical source for all content

---

## Decisions

- **Episode generation**: Reference doc has season-level arcs but not per-episode titles. We generate 36 episode titles/descriptions from Key Arcs and Notable Story Beats (6 per season × 6 seasons).
- **Character images**: SVG initial-based placeholders (dark bg, amber text) — can't source CC-licensed Peaky Blinders actor photos. Matches existing `CharacterCard` initials fallback.
- **Duplicate bug preservation**: Intentional duplicate character shifts from "duplicate Jesse Pinkman" to "duplicate Tommy Shelby" (or Arthur), maintaining workshop consistency.
- **Scope includes**: All 4 backend seed data, all 4 frontend UIs (1 Blazor + 3 React), design system, static assets.
- **Scope excludes**: Backend API code (controllers, models, migrations unchanged — data model is compatible), auth system, MCP servers, test files, BUGS.md, start scripts.
- **Design approach**: Dark industrial aesthetic, amber/gold accents, no white backgrounds, serif display headings. Inspired by 1920s Birmingham.
- **Fonts**: Google Fonts CDN (Playfair Display + Inter) — simplest approach, no self-hosting complexity.
