# Layout Blueprints — FanHub Rebrand

> Full-page HTML structures that change the SKELETON of each page, not just the skin.
> Each archetype produces a fundamentally different DOM structure, grid layout,
> section ordering, and interaction pattern.
>
> **The rule:** If you swap the CSS between two shows and the pages still look similar,
> you didn't change the layout. These blueprints ensure the HTML itself is different.

---

## How to Use This File

1. Phase 0 selects a **Layout Archetype** (one of 5 below)
2. Phase 3 builds each page using the matching blueprint's DOM structure
3. CSS from `css-patterns.md` is applied ON TOP of the blueprint — not instead of it
4. The blueprint determines section ordering, grid type, content grouping, and interaction model

---

## Layout Archetype Selection

| Show type | Archetype | Key structural trait |
|---|---|---|
| Sci-fi, military, intelligence | **Command Console** | Split-panel dashboard, data readouts, status indicators, asymmetric grid |
| Period crime, 1920s–1950s | **Dossier Archive** | File-cabinet layout, tabbed navigation, document-style pages, stamp marks |
| Fantasy, epic, mythological | **Chronicle Codex** | Scroll-like vertical flow, illuminated drop caps, chapter markers, parchment panels |
| Modern crime, noir, thriller | **Evidence Wall** | Pinboard layout, cards at angles, thread connections, polaroid-style images |
| Prestige drama, literary | **Editorial Magazine** | Multi-column editorial layout, pull quotes, feature articles, masthead |
| Dystopian, post-apocalyptic | **Terminal Interface** | Monospaced everything, command prompts, blinking cursors, scan lines |

---

## Home Page Blueprints

### Command Console (Sci-fi / Military)

The homepage is a **bridge command display** — asymmetric panels, live system readouts,
a central viewport, and status indicators.

```razor
@page "/"
@inject HttpClient Http

<PageTitle>FanHub - {ShowName}</PageTitle>

<div class="console-layout">

    @* LEFT PANEL — System status / stats readout *@
    <aside class="console-panel console-left">
        <div class="panel-header">
            <span class="scan-line-label">SYSTEM STATUS</span>
            <span class="status-dot status-active"></span>
        </div>
        <div class="readout-grid">
            <div class="readout-item">
                <span class="readout-value">@characterCount</span>
                <span class="readout-label">PERSONNEL</span>
            </div>
            <div class="readout-item">
                <span class="readout-value">62</span>
                <span class="readout-label">MISSIONS</span>
            </div>
            <div class="readout-item">
                <span class="readout-value">@quoteCount</span>
                <span class="readout-label">TRANSMISSIONS</span>
            </div>
            <div class="readout-item">
                <span class="readout-value">@locationCount</span>
                <span class="readout-label">LOCATIONS</span>
            </div>
        </div>

        @if (qotd != null)
        {
            <div class="transmission-log">
                <div class="log-header scan-line-label">[INCOMING TRANSMISSION]</div>
                <blockquote class="log-body">"@qotd.QuoteText"</blockquote>
                <div class="log-source">SOURCE: @qotdCharacterName</div>
            </div>
        }
    </aside>

    @* CENTER — Main viewport / hero *@
    <main class="console-viewport">
        <div class="viewport-hud">
            <span class="hud-corner hud-tl"></span>
            <span class="hud-corner hud-tr"></span>
            <span class="hud-corner hud-bl"></span>
            <span class="hud-corner hud-br"></span>
        </div>
        <div class="viewport-content">
            <div class="classification-stamp">CLASSIFIED · INTEL ARCHIVE</div>
            <h1 class="viewport-title">{Show Name}</h1>
            <p class="viewport-tagline">{Show tagline}</p>
        </div>
        <div class="viewport-description">
            <p>{Show description from universe file}</p>
        </div>
    </main>

    @* RIGHT PANEL — Navigation / quick access *@
    <aside class="console-panel console-right">
        <div class="panel-header">
            <span class="scan-line-label">NAVIGATION</span>
        </div>
        <nav class="console-nav">
            <a href="/characters" class="console-nav-item">
                <span class="nav-indicator">▸</span>
                <span class="nav-text">Personnel Files</span>
                <span class="nav-count">@characterCount</span>
            </a>
            <a href="/episodes" class="console-nav-item">
                <span class="nav-indicator">▸</span>
                <span class="nav-text">Mission Logs</span>
                <span class="nav-count">62</span>
            </a>
            <a href="/quotes" class="console-nav-item">
                <span class="nav-indicator">▸</span>
                <span class="nav-text">Transmissions</span>
                <span class="nav-count">@quoteCount</span>
            </a>
            <a href="/locations" class="console-nav-item">
                <span class="nav-indicator">▸</span>
                <span class="nav-text">Coordinates</span>
                <span class="nav-count">@locationCount</span>
            </a>
        </nav>
    </aside>

</div>
```

**Key CSS for Command Console layout:**

```css
.console-layout {
    display: grid;
    grid-template-columns: 280px 1fr 240px;
    grid-template-rows: 1fr;
    min-height: 100vh;
    gap: 1px;
    background: var(--color-border);
}
.console-panel {
    background: var(--color-bg);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}
.console-viewport {
    background: var(--color-bg);
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
}
/* HUD corner brackets on viewport */
.hud-corner { position: absolute; width: 30px; height: 30px; }
.hud-tl { top: 1rem; left: 1rem; border-top: 2px solid var(--color-accent); border-left: 2px solid var(--color-accent); }
.hud-tr { top: 1rem; right: 1rem; border-top: 2px solid var(--color-accent); border-right: 2px solid var(--color-accent); }
.hud-bl { bottom: 1rem; left: 1rem; border-bottom: 2px solid var(--color-accent); border-left: 2px solid var(--color-accent); }
.hud-br { bottom: 1rem; right: 1rem; border-bottom: 2px solid var(--color-accent); border-right: 2px solid var(--color-accent); }

.readout-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}
.readout-item {
    border: 1px solid var(--color-border);
    padding: 0.75rem;
    text-align: center;
}
.readout-value {
    display: block;
    font-family: var(--font-mono, var(--font-display));
    font-size: 1.8rem;
    color: var(--color-accent);
}
.readout-label {
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    color: var(--color-text-muted);
}

.console-nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    margin-bottom: 0.5rem;
    text-decoration: none;
    color: var(--color-text);
    transition: all 0.2s;
}
.console-nav-item:hover {
    border-color: var(--color-accent);
    background: rgba(var(--color-accent-rgb), 0.05);
}
.nav-count {
    margin-left: auto;
    font-family: var(--font-mono, var(--font-display));
    color: var(--color-accent);
}

/* Responsive: stack on mobile */
@media (max-width: 900px) {
    .console-layout {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
    }
}
```

---

### Dossier Archive (Period Crime)

The homepage is a **case file** that's been opened on a desk — a stamped manila folder
with tabs, a pinned photo, and handwritten-looking annotations.

```razor
@page "/"
@inject HttpClient Http

<PageTitle>FanHub - {ShowName}</PageTitle>

<div class="dossier-cover">
    <div class="folder-tab">CLASSIFIED — INTELLIGENCE DIVISION</div>
    <div class="folder-stamp">CASE FILE #001</div>
    <div class="folder-content">
        <h1 class="folder-title">{Show Name}</h1>
        <p class="folder-subtitle">{Tagline — handwritten feel}</p>
    </div>
</div>

<div class="dossier-body">

    @* Section 1: The brief — horizontal split with stats and description side by side *@
    <section class="case-brief">
        <div class="brief-stats">
            <div class="brief-stat doc-rule">
                <span class="brief-label">SERIES</span>
                <span class="brief-value">6</span>
            </div>
            <div class="brief-stat doc-rule">
                <span class="brief-label">EPISODES</span>
                <span class="brief-value">36</span>
            </div>
            <div class="brief-stat doc-rule">
                <span class="brief-label">OPERATIVES</span>
                <span class="brief-value">@characterCount</span>
            </div>
            <div class="brief-stat doc-rule">
                <span class="brief-label">NETWORK</span>
                <span class="brief-value">BBC</span>
            </div>
        </div>
        <div class="brief-summary doc-rule">
            <div class="annotation-label">BACKGROUND</div>
            <p>{Show description}</p>
        </div>
    </section>

    @* Section 2: Intercepted communication (QOTD) — styled as a telegram or wiretap *@
    @if (qotd != null)
    {
        <section class="intercepted-comm">
            <div class="comm-header">
                <span class="label-era">INTERCEPTED COMMUNICATION</span>
                <span class="comm-timestamp">@DateTime.Now.ToString("dd MMM yyyy HH:mm")</span>
            </div>
            <div class="comm-body">
                <blockquote>"@qotd.QuoteText"</blockquote>
                <div class="comm-source">— @qotdCharacterName</div>
            </div>
        </section>
    }

    @* Section 3: File tabs — not cards, but tabbed documents *@
    <section class="file-tabs">
        <a href="/characters" class="file-tab">
            <div class="tab-label">PERSONNEL</div>
            <div class="tab-count">@characterCount files</div>
            <div class="tab-desc">{Short description}</div>
            <div class="tab-pull">OPEN FILE →</div>
        </a>
        <a href="/episodes" class="file-tab">
            <div class="tab-label">OPERATIONS</div>
            <div class="tab-count">36 records</div>
            <div class="tab-desc">{Short description}</div>
            <div class="tab-pull">OPEN FILE →</div>
        </a>
        <a href="/quotes" class="file-tab">
            <div class="tab-label">TRANSCRIPTS</div>
            <div class="tab-count">@quoteCount records</div>
            <div class="tab-desc">{Short description}</div>
            <div class="tab-pull">OPEN FILE →</div>
        </a>
    </section>

</div>
```

**Key CSS for Dossier Archive layout:**

```css
.dossier-cover {
    position: relative;
    padding: 4rem 2rem 3rem;
    background: var(--color-surface);
    border-bottom: 3px solid var(--color-accent);
}
.folder-tab {
    position: absolute;
    top: 0;
    left: 2rem;
    background: var(--color-accent);
    color: var(--color-bg);
    padding: 0.3rem 1.5rem;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
}
.folder-stamp {
    position: absolute;
    top: 1rem;
    right: 2rem;
    color: var(--color-danger);
    font-family: var(--font-display);
    font-size: 1.2rem;
    transform: rotate(-5deg);
    opacity: 0.7;
    border: 2px solid var(--color-danger);
    padding: 0.2rem 0.8rem;
}

.case-brief {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 2rem;
    padding: 2rem;
}
.brief-stats {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.brief-stat {
    padding-left: 1rem;
}

.file-tabs {
    display: flex;
    gap: 0;
}
.file-tab {
    flex: 1;
    padding: 1.5rem;
    border: 1px solid var(--color-border);
    border-top: 3px solid transparent;
    text-decoration: none;
    color: var(--color-text);
    transition: all 0.2s;
    position: relative;
}
.file-tab:hover {
    border-top-color: var(--color-accent);
    background: var(--color-surface);
}
.file-tab::before {
    content: "";
    position: absolute;
    top: -3px;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--color-accent);
    transform: scaleX(0);
    transition: transform 0.3s;
}
.file-tab:hover::before {
    transform: scaleX(1);
}
```

---

### Chronicle Codex (Fantasy / Epic)

The homepage is an **ancient scroll** — vertical narrative flow, illuminated drop caps,
chapter markers, decorative dividers between sections.

```razor
@page "/"
@inject HttpClient Http

<PageTitle>FanHub - {ShowName}</PageTitle>

<div class="codex-page">

    @* Opening illumination — full-width cinematic header with decorative border *@
    <header class="codex-illumination">
        <div class="illumination-border">
            <div class="rune-corner rune-tl">⟐</div>
            <div class="rune-corner rune-tr">⟐</div>
            <div class="rune-corner rune-bl">⟐</div>
            <div class="rune-corner rune-br">⟐</div>
        </div>
        <div class="codex-title-block">
            <div class="codex-chapter-mark">— Volume I —</div>
            <h1 class="codex-title">{Show Name}</h1>
            <div class="divider-rune">✦</div>
            <p class="codex-subtitle">{Tagline}</p>
        </div>
    </header>

    @* The chronicle — single-column narrative layout with drop cap *@
    <article class="chronicle-entry">
        <p class="chronicle-text">
            <span class="drop-cap">{First letter}</span>{Rest of show description}
        </p>
    </article>

    @* Oracle's words (QOTD) — centered, decorative, illuminated *@
    @if (qotd != null)
    {
        <section class="oracle-speech">
            <div class="divider-rune">✦</div>
            <blockquote class="oracle-text">"@qotd.QuoteText"</blockquote>
            <cite class="oracle-source">— @qotdCharacterName</cite>
            <div class="divider-rune">✦</div>
        </section>
    }

    @* The archives — stacked vertical sections, not a card grid *@
    <section class="codex-chapters">
        <a href="/characters" class="chapter-entry">
            <div class="chapter-number">I</div>
            <div class="chapter-content">
                <h2 class="chapter-title">{Characters section name}</h2>
                <p class="chapter-desc">{Description}</p>
            </div>
            <div class="chapter-arrow">→</div>
        </a>
        <div class="divider-rune">·</div>
        <a href="/episodes" class="chapter-entry">
            <div class="chapter-number">II</div>
            <div class="chapter-content">
                <h2 class="chapter-title">{Episodes section name}</h2>
                <p class="chapter-desc">{Description}</p>
            </div>
            <div class="chapter-arrow">→</div>
        </a>
        <div class="divider-rune">·</div>
        <a href="/quotes" class="chapter-entry">
            <div class="chapter-number">III</div>
            <div class="chapter-content">
                <h2 class="chapter-title">{Quotes section name}</h2>
                <p class="chapter-desc">{Description}</p>
            </div>
            <div class="chapter-arrow">→</div>
        </a>
    </section>

    @* Realm stats — horizontal ornamental bar *@
    <footer class="codex-colophon">
        <div class="colophon-stat">
            <span class="colophon-value">@characterCount</span>
            <span class="colophon-label">Souls</span>
        </div>
        <div class="colophon-divider">·</div>
        <div class="colophon-stat">
            <span class="colophon-value">8</span>
            <span class="colophon-label">Seasons</span>
        </div>
        <div class="colophon-divider">·</div>
        <div class="colophon-stat">
            <span class="colophon-value">73</span>
            <span class="colophon-label">Chronicles</span>
        </div>
    </footer>

</div>
```

**Key CSS for Chronicle Codex layout:**

```css
.codex-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}
.codex-illumination {
    position: relative;
    text-align: center;
    padding: 5rem 2rem;
    border: 1px solid var(--color-border);
    margin-bottom: 3rem;
}
.rune-corner {
    position: absolute;
    font-size: 1.5rem;
    color: var(--color-accent);
    opacity: 0.6;
}
.rune-tl { top: 0.5rem; left: 0.5rem; }
.rune-tr { top: 0.5rem; right: 0.5rem; transform: rotate(90deg); }
.rune-bl { bottom: 0.5rem; left: 0.5rem; transform: rotate(-90deg); }
.rune-br { bottom: 0.5rem; right: 0.5rem; transform: rotate(180deg); }

.drop-cap {
    float: left;
    font-family: var(--font-display);
    font-size: 4.5rem;
    line-height: 0.8;
    padding-right: 0.15em;
    color: var(--color-accent);
    font-weight: 900;
}

.chapter-entry {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem;
    text-decoration: none;
    color: var(--color-text);
    border: 1px solid transparent;
    transition: all 0.3s;
}
.chapter-entry:hover {
    border-color: var(--color-accent);
}
.chapter-number {
    font-family: var(--font-display);
    font-size: 2rem;
    color: var(--color-accent);
    min-width: 3rem;
    text-align: center;
}

.codex-colophon {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
    border-top: 1px solid var(--color-border);
    margin-top: 3rem;
    text-align: center;
}
```

---

### Evidence Wall (Modern Crime / Noir)

The homepage is a **detective's evidence board** — scattered cards at slight angles,
red thread connectors, a central "case" hero, and pinboard texture.

```razor
@page "/"
@inject HttpClient Http

<PageTitle>FanHub - {ShowName}</PageTitle>

<div class="evidence-board">

    @* The case header — crime scene tape aesthetic *@
    <header class="case-header">
        <div class="tape-strip">CASE FILE — ACTIVE INVESTIGATION</div>
        <h1 class="case-title">{Show Name}</h1>
        <p class="case-status">{Tagline}</p>
    </header>

    @* The board — irregular grid with pinned items *@
    <div class="pinboard">

        @* Pinned case summary — larger, center-ish *@
        <div class="pinned-card pinned-summary" style="grid-column: 1 / 3;">
            <div class="pin"></div>
            <div class="card-content">
                <div class="evidence-tag">CASE SUMMARY</div>
                <p>{Show description}</p>
            </div>
        </div>

        @* QOTD as intercepted wiretap *@
        @if (qotd != null)
        {
            <div class="pinned-card pinned-wiretap" style="grid-column: 3;">
                <div class="pin"></div>
                <div class="card-content">
                    <div class="evidence-tag">WIRETAP — @qotdCharacterName</div>
                    <blockquote>"@qotd.QuoteText"</blockquote>
                </div>
            </div>
        }

        @* Navigation "evidence items" — each a different pinned document *@
        <a href="/characters" class="pinned-card pinned-nav">
            <div class="pin"></div>
            <div class="card-content">
                <div class="evidence-tag">SUSPECTS — @characterCount persons of interest</div>
                <h3>{Character section name}</h3>
                <p>{Short description}</p>
            </div>
        </a>

        <a href="/episodes" class="pinned-card pinned-nav">
            <div class="pin"></div>
            <div class="card-content">
                <div class="evidence-tag">TIMELINE — 36 events logged</div>
                <h3>{Episode section name}</h3>
                <p>{Short description}</p>
            </div>
        </a>

        <a href="/quotes" class="pinned-card pinned-nav">
            <div class="pin"></div>
            <div class="card-content">
                <div class="evidence-tag">TRANSCRIPTS — @quoteCount recordings</div>
                <h3>{Quote section name}</h3>
                <p>{Short description}</p>
            </div>
        </a>

    </div>

    @* Stats as case metadata footer *@
    <footer class="case-metadata">
        <span>@characterCount suspects</span>
        <span class="meta-divider">|</span>
        <span>36 episodes</span>
        <span class="meta-divider">|</span>
        <span>@quoteCount on record</span>
        <span class="meta-divider">|</span>
        <span>Case opened: {StartYear}</span>
    </footer>

</div>
```

**Key CSS for Evidence Wall layout:**

```css
.evidence-board {
    min-height: 100vh;
    padding: 2rem;
}
.case-header {
    text-align: center;
    padding: 3rem 0;
    position: relative;
}
.tape-strip {
    display: inline-block;
    background: var(--color-danger);
    color: #fff;
    padding: 0.3rem 2rem;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    transform: rotate(-1deg);
    margin-bottom: 1rem;
}

.pinboard {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 0;
}

.pinned-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    padding: 1.5rem 1.5rem 1rem;
    position: relative;
    text-decoration: none;
    color: var(--color-text);
    transition: transform 0.2s, box-shadow 0.2s;
}
.pinned-card:nth-child(odd) { transform: rotate(-0.5deg); }
.pinned-card:nth-child(even) { transform: rotate(0.5deg); }
.pinned-card:hover {
    transform: rotate(0deg) scale(1.02);
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
    z-index: 2;
}

.pin {
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 12px;
    background: var(--color-danger);
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.evidence-tag {
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--color-text-muted);
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-border);
}

.case-metadata {
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: 2rem;
    font-size: 0.8rem;
    color: var(--color-text-muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
}

@media (max-width: 768px) {
    .pinboard { grid-template-columns: 1fr; }
    .pinned-card { transform: none !important; }
}
```

---

### Editorial Magazine (Prestige Drama)

The homepage is a **magazine cover / feature spread** — multi-column editorial layout,
large feature image area, pull quotes in margins, masthead.

```razor
@page "/"
@inject HttpClient Http

<PageTitle>FanHub - {ShowName}</PageTitle>

<div class="magazine-layout">

    @* Masthead *@
    <header class="masthead">
        <div class="masthead-rule"></div>
        <div class="masthead-content">
            <span class="masthead-date">Est. {StartYear}</span>
            <h1 class="masthead-title">{Show Name}</h1>
            <span class="masthead-edition">{Network} · {TotalSeasons} Seasons</span>
        </div>
        <div class="masthead-rule"></div>
    </header>

    @* Feature story — two-column with lead paragraph and pull quote *@
    <section class="feature-story">
        <div class="feature-lead">
            <p class="lead-dropcap">
                <span class="drop-cap">{First letter}</span>{Show description}
            </p>
        </div>
        @if (qotd != null)
        {
            <aside class="feature-pullquote">
                <blockquote>"@qotd.QuoteText"</blockquote>
                <cite>— @qotdCharacterName</cite>
            </aside>
        }
    </section>

    @* Section navigation — magazine "departments" *@
    <nav class="departments">
        <div class="department-rule"></div>
        <div class="department-grid">
            <a href="/characters" class="department">
                <span class="dept-number">01</span>
                <h2 class="dept-title">{Characters name}</h2>
                <p class="dept-desc">{Description}</p>
            </a>
            <a href="/episodes" class="department">
                <span class="dept-number">02</span>
                <h2 class="dept-title">{Episodes name}</h2>
                <p class="dept-desc">{Description}</p>
            </a>
            <a href="/quotes" class="department">
                <span class="dept-number">03</span>
                <h2 class="dept-title">{Quotes name}</h2>
                <p class="dept-desc">{Description}</p>
            </a>
            <a href="/locations" class="department">
                <span class="dept-number">04</span>
                <h2 class="dept-title">{Locations name}</h2>
                <p class="dept-desc">{Description}</p>
            </a>
        </div>
    </nav>

    @* Stats as colophon / byline *@
    <footer class="colophon">
        <span>@characterCount Characters</span>
        <span>·</span>
        <span>62 Episodes</span>
        <span>·</span>
        <span>@quoteCount Quotes</span>
    </footer>

</div>
```

**Key CSS for Editorial Magazine layout:**

```css
.magazine-layout {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
}
.masthead {
    text-align: center;
    padding: 2rem 0;
}
.masthead-rule {
    height: 2px;
    background: var(--color-text);
}
.masthead-title {
    font-family: var(--font-display);
    font-size: clamp(3rem, 8vw, 6rem);
    line-height: 0.9;
    margin: 0.5rem 0;
}
.masthead-date, .masthead-edition {
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--color-text-muted);
}

.feature-story {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 3rem;
    padding: 3rem 0;
    border-bottom: 1px solid var(--color-border);
}
.feature-pullquote {
    border-left: 3px solid var(--color-accent);
    padding-left: 1.5rem;
    font-family: var(--font-display);
    font-size: 1.3rem;
    font-style: italic;
    align-self: center;
}
.feature-pullquote cite {
    display: block;
    font-size: 0.8rem;
    margin-top: 0.5rem;
    font-style: normal;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-text-muted);
}

.department-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
}
.department {
    padding: 1.5rem;
    border-right: 1px solid var(--color-border);
    text-decoration: none;
    color: var(--color-text);
    transition: background 0.2s;
}
.department:last-child { border-right: none; }
.department:hover { background: var(--color-surface); }
.dept-number {
    font-family: var(--font-display);
    font-size: 2rem;
    color: var(--color-accent);
    display: block;
    margin-bottom: 0.5rem;
}

.colophon {
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: 2rem 0;
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-text-muted);
    border-top: 2px solid var(--color-text);
}
```

---

## Characters Page Blueprints

### Command Console — Personnel Grid

Two-column layout: left sidebar with search/filter, main area with personnel cards.

```razor
<div class="personnel-layout">
    <aside class="filter-panel">
        <div class="panel-header scan-line-label">FILTER PERSONNEL</div>
        @* Filters as toggle buttons, not dropdowns *@
        <div class="filter-group">
            <button class="filter-btn active">ALL</button>
            <button class="filter-btn">CREW</button>
            <button class="filter-btn">COMMAND</button>
        </div>
    </aside>
    <main class="personnel-grid">
        @* Cards in an asymmetric masonry-like grid *@
        @foreach (var character in characters)
        {
            <div class="card-file personnel-card">
                @* ... card content ... *@
            </div>
        }
    </main>
</div>
```

### Dossier Archive — File Drawer

Vertical stacked files that expand on click — like pulling a file from a cabinet.

```razor
<div class="file-drawer">
    <div class="drawer-header">
        <span class="label-era">PERSONNEL FILES — @characters?.Count RECORDS</span>
    </div>
    @foreach (var character in characters)
    {
        <div class="file-entry @(selectedCharacter?.Id == character.Id ? "file-open" : "")"
             @onclick="() => SelectCharacter(character)">
            <div class="file-tab-edge"></div>
            <div class="file-summary">
                <span class="file-name">@character.Name</span>
                <span class="file-type label-era">@character.CharacterType</span>
                <span class="badge badge-@character.Status.ToLower()">@character.Status</span>
            </div>
            @if (selectedCharacter?.Id == character.Id)
            {
                <div class="file-expanded">
                    <img src="@GetImageUrl(character)" alt="@character.Name" class="dossier-photo" />
                    <p class="bio">@character.Bio</p>
                </div>
            }
        </div>
    }
</div>
```

### Chronicle Codex — Character Scroll

Single-column narrative list — each character is a "passage" in the chronicle.

```razor
<div class="codex-page">
    <header class="codex-chapter-header">
        <div class="chapter-number">BOOK I</div>
        <h1 class="codex-title">The Souls of {Show World}</h1>
    </header>
    @foreach (var character in characters)
    {
        <article class="chronicle-character">
            <div class="chronicle-sidebar">
                <img src="@GetImageUrl(character)" alt="@character.Name" class="chronicle-portrait" />
                <span class="badge badge-@character.Status.ToLower()">@character.Status</span>
            </div>
            <div class="chronicle-body">
                <h2>@character.Name</h2>
                <div class="label-era">@character.CharacterType</div>
                <p class="chronicle-text">@character.Bio</p>
            </div>
        </article>
        <div class="divider-rune">·</div>
    }
</div>
```

### Evidence Wall — Suspect Board

3-column pinboard with cards at slight angles and red pins.

```razor
<div class="evidence-board">
    <div class="tape-strip">PERSONS OF INTEREST — @characters?.Count PROFILES</div>
    <div class="suspect-board">
        @foreach (var character in characters)
        {
            <div class="pinned-card suspect-card @(selectedCharacter?.Id == character.Id ? "card-focused" : "")"
                 @onclick="() => SelectCharacter(character)">
                <div class="pin"></div>
                <img src="@GetImageUrl(character)" alt="@character.Name" class="suspect-photo" />
                <div class="evidence-tag">@character.CharacterType</div>
                <h3>@character.Name</h3>
                <span class="badge badge-@character.Status.ToLower()">@character.Status</span>
            </div>
        }
    </div>
</div>
```

---

## Episodes Page Blueprints

### Command Console — Mission Log Timeline

Vertical timeline with alternating left/right episode entries.

```razor
<div class="mission-timeline">
    <div class="timeline-axis"></div>
    @foreach (var episode in filteredEpisodes)
    {
        <div class="timeline-entry @(episode.EpisodeNumber % 2 == 0 ? "entry-right" : "entry-left")">
            <div class="timeline-node"></div>
            <div class="card-file">
                <div class="label-era">S@(episode.SeasonId.ToString("D2"))E@(episode.EpisodeNumber.ToString("D2"))</div>
                <h3>@episode.Title</h3>
                <p>@episode.Description</p>
            </div>
        </div>
    }
</div>
```

### Dossier Archive — Operations Log Table

Dense table/ledger layout — not cards. Like a handwritten operations log.

```razor
<div class="ops-ledger">
    <div class="ledger-header">
        <span class="label-era">OPERATIONS LOG</span>
        @* Season filter as tab buttons *@
    </div>
    <table class="ledger-table">
        <thead>
            <tr>
                <th>REF</th>
                <th>OPERATION</th>
                <th>BRIEFING</th>
                <th>DATE</th>
            </tr>
        </thead>
        <tbody>
            @foreach (var ep in filteredEpisodes)
            {
                <tr>
                    <td class="ledger-ref">S@(ep.SeasonId)E@(ep.EpisodeNumber)</td>
                    <td class="ledger-title">@ep.Title</td>
                    <td class="ledger-desc">@ep.Description</td>
                    <td class="ledger-date">@ep.AirDate.ToString("dd MMM yyyy")</td>
                </tr>
            }
        </tbody>
    </table>
</div>
```

### Editorial Magazine — Episode Features

Each episode as a magazine article snippet with large typography.

```razor
<div class="magazine-layout">
    <div class="article-list">
        @foreach (var ep in filteredEpisodes)
        {
            <article class="article-entry">
                <div class="article-meta">
                    <span class="dept-number">S@(ep.SeasonId)E@(ep.EpisodeNumber)</span>
                    <span class="article-date">@ep.AirDate.ToString("MMMM d, yyyy")</span>
                </div>
                <h2 class="article-headline">@ep.Title</h2>
                <p class="article-lede">@ep.Description</p>
                <div class="article-rule"></div>
            </article>
        }
    </div>
</div>
```

---

## Quotes Page Blueprints

### Command Console — Transmission Feed

Vertical feed styled as incoming transmissions with timestamps and signal indicators.

```razor
<div class="transmission-feed">
    <div class="feed-header scan-line-label">[TRANSMISSION ARCHIVE — @quotes?.Count RECORDS]</div>
    @foreach (var quote in quotes)
    {
        <div class="transmission-entry card-file">
            <div class="transmission-meta">
                <span class="signal-indicator">▮▮▮▯▯</span>
                <span class="label-era">@quote.Character?.Name</span>
            </div>
            <blockquote class="text-quote">@quote.QuoteText</blockquote>
            @if (quote.Episode != null)
            {
                <div class="label-era">@quote.Episode.Title</div>
            }
        </div>
    }
</div>
```

### Evidence Wall — Transcript Wall

Quotes as "intercepted conversations" pinned to the board.

```razor
<div class="evidence-board">
    <div class="tape-strip">INTERCEPTED COMMUNICATIONS</div>
    <div class="transcript-board">
        @foreach (var quote in quotes)
        {
            <div class="pinned-card transcript-card">
                <div class="pin"></div>
                <div class="evidence-tag">WIRETAP — @quote.Character?.Name</div>
                <blockquote class="text-quote">"@quote.QuoteText"</blockquote>
            </div>
        }
    </div>
</div>
```

---

## Navigation Blueprints

### Command Console Nav

Translucent dark bar with monospaced nav items and status indicators.

```razor
<nav class="console-nav-bar">
    <a href="/" class="nav-brand">
        <span class="brand-indicator">▸</span>
        <span class="brand-text">{Show Name}</span>
    </a>
    <div class="nav-links">
        <a href="/" class="nav-link @(currentUrl == "/" ? "nav-active" : "")">HOME</a>
        <a href="/characters" class="nav-link">CREW</a>
        <a href="/episodes" class="nav-link">MISSIONS</a>
        <a href="/quotes" class="nav-link">COMMS</a>
        <a href="/locations" class="nav-link">COORDS</a>
    </div>
    <div class="nav-status">
        <span class="status-dot status-active"></span>
        <span class="nav-system-label">ONLINE</span>
    </div>
</nav>
```

### Dossier Archive Nav

Dark bar with manila-folder tabs for each section.

```razor
<nav class="dossier-nav">
    <a href="/" class="nav-brand folder-tab-brand">{Show Name}</a>
    <div class="nav-tabs">
        <a href="/characters" class="nav-tab">PERSONNEL</a>
        <a href="/episodes" class="nav-tab">OPERATIONS</a>
        <a href="/quotes" class="nav-tab">TRANSCRIPTS</a>
        <a href="/locations" class="nav-tab">LOCATIONS</a>
    </div>
</nav>
```

### Editorial Magazine Nav

Minimal masthead-style nav — thin rule top and bottom, centered brand.

```razor
<nav class="magazine-nav">
    <div class="nav-rule-top"></div>
    <div class="nav-content">
        <div class="nav-links-left">
            <a href="/characters" class="nav-link">Characters</a>
            <a href="/episodes" class="nav-link">Episodes</a>
        </div>
        <a href="/" class="nav-brand-center">{Show Name}</a>
        <div class="nav-links-right">
            <a href="/quotes" class="nav-link">Quotes</a>
            <a href="/locations" class="nav-link">Locations</a>
        </div>
    </div>
    <div class="nav-rule-bottom"></div>
</nav>
```

### Chronicle Codex Nav

Ornamental nav with decorative dividers between items.

```razor
<nav class="codex-nav">
    <a href="/" class="nav-brand codex-brand">{Show Name}</a>
    <div class="nav-links">
        <a href="/characters">Souls</a>
        <span class="nav-ornament">✦</span>
        <a href="/episodes">Chronicles</a>
        <span class="nav-ornament">✦</span>
        <a href="/quotes">Words</a>
        <span class="nav-ornament">✦</span>
        <a href="/locations">Realms</a>
    </div>
</nav>
```
