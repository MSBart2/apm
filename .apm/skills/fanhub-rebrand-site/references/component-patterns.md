# Component Patterns — FanHub Rebrand

> Markup templates for Phase 3 (Blazor) and Phase 4 (React) of the rebrand-site skill.
> These are NOT copy-paste implementations — they are **structural patterns** that show
> how to apply each Component Aesthetic Brief in markup. Adapt to the actual component
> data model and Blazor/React conventions when implementing.

---

## Characters Component

### Dossier / Police File Card

_Use for: period crime, gang shows, police procedurals_

**Blazor (.razor)**

```razor
<div class="card-dossier bracket-corner">
  <div class="label-era">Intelligence File — @character.CharacterType</div>
  <div class="dossier-number text-label">CASE #@character.Id.ToString("D4")</div>
  <img src="@imageUrl" alt="@character.Name" class="dossier-photo" />
  <h2 class="text-section">@character.Name</h2>
  <div class="doc-rule">
    <p class="bio">@character.Bio</p>
  </div>
  @if (!string.IsNullOrEmpty(character.Tagline))
  {
    <p class="tagline">"@character.Tagline"</p>
  }
  <span class="badge badge-@character.Status.ToLower()">@character.Status</span>
</div>
```

**React (JSX)**

```jsx
<div className="card-dossier bracket-corner">
  <div className="label-era">Intelligence File — {character.characterType}</div>
  <div className="dossier-number text-label">
    CASE #{String(character.id).padStart(4, "0")}
  </div>
  <img src={imageUrl} alt={character.name} className="dossier-photo" />
  <h2 className="text-section">{character.name}</h2>
  <div className="doc-rule">
    <p className="bio">{character.bio}</p>
  </div>
  {character.tagline && <p className="tagline">"{character.tagline}"</p>}
  <span className={`badge badge-${character.status.toLowerCase()}`}>
    {character.status}
  </span>
</div>
```

---

### Personnel File Card

_Use for: sci-fi, military/intelligence, modern thriller_

**Blazor (.razor)**

```razor
<div class="card-file">
  <div class="file-header">
    <span class="label-era">PERSONNEL / @character.CharacterType</span>
    <span class="status-dot status-@character.Status.ToLower()"></span>
  </div>
  <img src="@imageUrl" alt="@character.Name" class="file-photo" />
  <h2>@character.Name</h2>
  <p class="bio">@character.Bio</p>
  <span class="badge badge-@character.Status.ToLower()">@character.Status</span>
</div>
```

**React (JSX)**

```jsx
<div className="card-file">
  <div className="file-header">
    <span className="label-era">PERSONNEL / {character.characterType}</span>
    <span
      className={`status-dot status-${character.status.toLowerCase()}`}
    ></span>
  </div>
  <img src={imageUrl} alt={character.name} className="file-photo" />
  <h2>{character.name}</h2>
  <p className="bio">{character.bio}</p>
  <span className={`badge badge-${character.status.toLowerCase()}`}>
    {character.status}
  </span>
</div>
```

---

### Wanted Poster / Society Record Card

_Use for: fantasy, Western, Victorian period dramas_

**Blazor (.razor)**

```razor
<div class="card-broadsheet">
  <div class="card-dateline label-era">@character.CharacterType · @character.Status</div>
  <img src="@imageUrl" alt="@character.Name" class="poster-photo" />
  <h2 class="text-section">@character.Name</h2>
  <p class="bio">@character.Bio</p>
</div>
```

---

## Episodes Component

### Playbill / Theater Card

_Use for: period drama, shows with theatrical/entertainment heritage_

**Blazor (.razor)**

```razor
<div class="card-playbill">
  <div class="card-header">
    Series @episode.SeasonNumber &middot; Episode @episode.EpisodeNumber
  </div>
  <div class="card-body">
    <h3 class="text-section">@episode.Title</h3>
    <p>@episode.Description</p>
  </div>
</div>
```

**React (JSX)**

```jsx
<div className="card-playbill">
  <div className="card-header">
    Series {episode.seasonNumber} · Episode {episode.episodeNumber}
  </div>
  <div className="card-body">
    <h3 className="text-section">{episode.title}</h3>
    <p>{episode.description}</p>
  </div>
</div>
```

---

### Mission Briefing Card

_Use for: sci-fi, military, procedural, anything with a classified/operation feel_

**Blazor (.razor)**

```razor
<div class="card-file">
  <div class="label-era">
    S@episode.SeasonNumber.ToString("D2")E@episode.EpisodeNumber.ToString("D2") · MISSION LOG
  </div>
  <h3 class="text-section">@episode.Title</h3>
  <p class="mission-summary">@episode.Description</p>
</div>
```

**React (JSX)**

```jsx
<div className="card-file">
  <div className="label-era">
    S{String(episode.seasonNumber).padStart(2, "0")}E
    {String(episode.episodeNumber).padStart(2, "0")} · MISSION LOG
  </div>
  <h3 className="text-section">{episode.title}</h3>
  <p className="mission-summary">{episode.description}</p>
</div>
```

---

### Broadsheet / Chronicle Entry

_Use for: crime dramas, newspaper-adjacent, anything with a journalistic or chronicle feel_

**Blazor (.razor)**

```razor
<div class="card-broadsheet">
  <div class="card-dateline label-era">
    Series @episode.SeasonNumber, Episode @episode.EpisodeNumber
  </div>
  <h3 class="text-section">@episode.Title</h3>
  <p>@episode.Description</p>
</div>
```

---

## Quotes Component

### Telegram / Transcript Card

_Use for: 1920s–WWII era, crime, period shows with written communication_

**Blazor (.razor)**

```razor
<div class="quote-telegram">
  <div class="telegram-header label-era">
    TRANSCRIPT &middot; @quote.Character?.Name &middot; @quote.Episode?.Title
  </div>
  <blockquote class="telegram-body text-quote">
    <span class="quote-mark" aria-hidden="true">"</span>
    @quote.QuoteText
    <span class="quote-mark" aria-hidden="true">"</span>
  </blockquote>
  <div class="telegram-attribution label-era">— @quote.Character?.Name</div>
</div>
```

**React (JSX)**

```jsx
<div className="quote-telegram">
  <div className="telegram-header label-era">
    TRANSCRIPT · {quote.character?.name} · {quote.episode?.title}
  </div>
  <blockquote className="telegram-body text-quote">
    <span className="quote-mark" aria-hidden="true">
      "
    </span>
    {quote.quoteText}
    <span className="quote-mark" aria-hidden="true">
      "
    </span>
  </blockquote>
  <div className="telegram-attribution label-era">
    — {quote.character?.name}
  </div>
</div>
```

---

### Transmission Log Card

_Use for: sci-fi, military comms, any show with radio/signal communication_

**Blazor (.razor)**

```razor
<div class="quote-transmission card-file">
  <div class="label-era" style="font-family: var(--font-mono);">
    [TRANSMISSION] SOURCE: @quote.Character?.Name
  </div>
  <blockquote class="text-quote">@quote.QuoteText</blockquote>
  <div class="label-era">@quote.Episode?.Title</div>
</div>
```

**React (JSX)**

```jsx
<div className="quote-transmission card-file">
  <div className="label-era" style={{ fontFamily: "var(--font-mono)" }}>
    [TRANSMISSION] SOURCE: {quote.character?.name}
  </div>
  <blockquote className="text-quote">{quote.quoteText}</blockquote>
  <div className="label-era">{quote.episode?.title}</div>
</div>
```

---

### Editorial Pull Quote Card

_Use for: modern drama, prestige TV, any show where spoken dialogue is king_

**Blazor (.razor)**

```razor
<div class="quote-editorial doc-rule">
  <blockquote class="text-quote">@quote.QuoteText</blockquote>
  <cite class="label-era">
    @quote.Character?.Name
    @if (quote.Episode != null) { <span> · @quote.Episode.Title</span> }
  </cite>
</div>
```

---

## Shared CSS for Quote Components

Add to `app.css` alongside the quote card styles:

```css
.quote-mark {
  font-family: var(--font-display);
  font-size: 3rem;
  line-height: 0;
  vertical-align: -1rem;
  color: var(--color-accent);
  margin-right: 0.1em;
  opacity: 0.8;
}

.telegram-header {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.telegram-attribution {
  margin-top: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--color-border);
}
```

---

## NotFound (404) Page

Base structure — derive the tagline and CTA text from the show's universe file.
Pick a Famous Quote or an in-universe phrase that fits a "lost" or "wrong place" theme.

**Blazor (.razor)**

```razor
@page "/404"

<PageTitle>Not Found — {Show Name}</PageTitle>

<div class="not-found-page">
  <div class="not-found-inner">
    <div class="not-found-number text-hero" aria-hidden="true">404</div>
    <p class="label-era not-found-label">Page Not Found</p>
    <p class="not-found-tagline">{In-universe tagline from Phase 0}</p>
    <a href="/" class="btn-primary">{Return CTA} →</a>
  </div>
</div>
```

CSS:

```css
.not-found-page {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.not-found-number {
  color: var(--color-accent);
  opacity: 0.15;
  font-size: clamp(8rem, 20vw, 16rem);
  line-height: 1;
  margin-bottom: -2rem;
}
.not-found-label {
  margin-bottom: 1rem;
}
.not-found-tagline {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-style: italic;
  color: var(--color-text-muted);
  max-width: 40ch;
  margin: 0 auto 2rem;
}
```

---

## Deriving the return-home CTA text

The "Return Home" link should use show-appropriate language, not "Go Home" or "Back to Home."

| Show type                 | CTA text                             |
| ------------------------- | ------------------------------------ |
| Birmingham 1920s          | "Return to Small Heath →"            |
| Space opera               | "Return to the Ship →"               |
| Fantasy/medieval          | "Return to the Keep →"               |
| Modern crime              | "Back to the Precinct →"             |
| Journalism/procedural     | "Back to the Newsroom →"             |
| Derive from universe file | Pick the show's primary setting name |
