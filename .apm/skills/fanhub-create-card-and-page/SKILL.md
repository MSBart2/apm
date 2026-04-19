---
name: fanhub-create-card-and-page
description: >
  Use this skill when asked to add a new entity type to FanHub. Always scaffolds the
  complete full-stack implementation: backend model, DbContext registration, seed data,
  EF Core migration, REST controller (GET + POST), frontend model, homepage summary card
  (showing counts) + nav-card, header nav link, and a Blazor list page with an inline
  add form. Always include everything unless explicitly told otherwise.
---

> **CRITICAL — read before writing any frontend code:**
> If the entity has ANY foreign key to another entity beyond ShowId (CharacterId, EpisodeId, SeasonId, etc.)
> you MUST use **Template B**. **NEVER use `<input type="number">` for FK fields.** Every FK must be a
> `<select>` dropdown populated from the API.

## Clarify before starting

Ask if unclear; otherwise assume and proceed:

1. **Entity name** — singular PascalCase (`Location`, `Quote`)
2. **Properties** — beyond `Id` and `ShowId` (e.g. `string Title`, `string Description`)
3. **Plural label** — for stat card and nav (`"Quotes"`, `"Locations"`)
4. **Nav icon** — single emoji (📍, 💬)
5. **FK relationships?** → yes = Template B required; no = Template A

Seed 12–15 records from `docs/breaking-bad-universe.md`.

---

## Steps — complete all of them in order

### 0 — Check for partial existing implementation

Before writing anything, check whether the entity already exists:

- `dotnet/Backend/Models/{EntityName}.cs` — if present, **skip steps 1–2**; use the real property names it defines
- `dotnet/Backend/Controllers/{EntityName}sController.cs` — if present, **skip step 5**
- `dotnet/Frontend/Components/Pages/{EntityName}s.razor` — if present, **skip step 9**
- `dotnet/Backend/Data/FanHubContext.cs` DbSet registration — check before step 2

Only create what is missing. Never overwrite an existing file for steps 1–5.

### 1 — Backend model (`dotnet/Backend/Models/{EntityName}.cs`)

- `int Id`, `int ShowId`, core properties, `int` FK fields for related entities
- No navigation properties. All strings non-nullable.

### 2 — Register DbSet (`dotnet/Backend/Data/FanHubContext.cs`)

```csharp
public DbSet<{EntityName}> {EntityName}s { get; set; }
```

### 3 — Seed data (`dotnet/Backend/Data/SeedData.cs`)

Add a seed block after the last existing one. All records use `ShowId = 1`. Draw from `docs/breaking-bad-universe.md`.

### 4 — EF migration (run the script)

```powershell
.github/skills/create-card-and-page/scripts/run-migration.ps1 -EntityName {EntityName}
```

The script does three things in order:

1. **Stops** any running dotnet Backend processes
2. **Deletes** `fanhub.db` (and WAL/SHM files) so seed data applies fresh on next startup
3. **Adds** the EF migration (`dotnet ef migrations add Add{EntityName}`)

The backend calls `context.Database.Migrate()` on startup, which applies all pending migrations and then runs the seed. Stop and fix if the migration fails before continuing.

### 5 — Backend controller (`dotnet/Backend/Controllers/{EntityName}sController.cs`)

```csharp
[ApiController]
[Route("api/[controller]")]
public class {EntityName}sController : ControllerBase
{
    private readonly FanHubContext _context;
    public {EntityName}sController(FanHubContext context) { _context = context; }

    [HttpGet]
    public async Task<IActionResult> Get{EntityName}s()
        => Ok(await _context.{EntityName}s.ToListAsync());

    [HttpPost]
    public async Task<IActionResult> Create{EntityName}([FromBody] {EntityName} item)
    {
        _context.{EntityName}s.Add(item);
        await _context.SaveChangesAsync();
        return Ok(item);
    }
}
```

### 6 — Homepage stat card (`dotnet/Frontend/Components/Pages/Home.razor`)

Add to `@code`:

```csharp
private int {entityName}Count;
```

In `OnInitializedAsync()`, load in parallel with existing fetches:

```csharp
var {entityName}List = await Http.GetFromJsonAsync<List<{EntityName}>>("api/{entityNames}");
{entityName}Count = {entityName}List?.Count ?? 0;
```

Add inside `<div class="summary-card">` after the last `summary-stat`:

```html
<div class="summary-stat">
  <span class="stat-number">@{entityName}Count</span>
  <span class="stat-label">{Plural Label}</span>
</div>
```

### 7 — Homepage nav card (`dotnet/Frontend/Components/Pages/Home.razor`)

Add inside `<section class="nav-cards">` after the last `<a class="nav-card">`:

```html
<a href="/{entityNames}" class="nav-card">
  <div class="nav-card-icon">{emoji}</div>
  <h2>{Plural Label}</h2>
  <p>{One-sentence description.}</p>
  <span class="nav-card-cta">View {Plural Label} →</span>
</a>
```

### 8 — Header nav link (`dotnet/Frontend/Components/Layout/NavBar.razor`)

> ⚠️ The active nav component is **`NavBar.razor`** — NOT `NavMenu.razor`. `NavMenu.razor` is an unused Blazor sidebar template. Always edit `NavBar.razor`.

**First**, read the existing `<ul class="nav-links">` items. Add the new entity alongside them:

```html
<li><a href="/{entityNames}">{Plural Label}</a></li>
```

### 9 — Blazor list page (`dotnet/Frontend/Components/Pages/{EntityName}s.razor`)

**Template selection — non-negotiable:**

| Has FK beyond ShowId? | Template                                     |
| --------------------- | -------------------------------------------- |
| No                    | `templates/TemplateA_SimpleForm.razor.txt`   |
| Yes                   | `templates/TemplateB_DropdownForm.razor.txt` |

Open the template file and use it as the exact starting point. Replace all `{EntityName}`, `{entityNames}`, `{Plural Label}` placeholders with actual names.

**Template B (FK entities) — required patterns:**

- `<select>` dropdown for every FK field — never `<input type="number">`
- Nullable `int?` for all FK properties to prevent "0" default display
- Validate `.HasValue` on all FK fields before submission
- Load related entities in parallel with `Task.WhenAll`
- User-friendly option labels: character names, `S@@ep.SeasonId E@@ep.EpisodeNumber: @ep.Title`

**CSS** — Copy `templates/PageStyles.css.txt` in full into a `<style>` block at the bottom of the page. Do not write custom CSS from scratch. Replace `.{entityNames}-page` / `.{entityName}-card` class placeholders with actual names. The styles include: staggered `fadeInUp` card animations, `.card-index` / `.card-body` / `.card-footer` / `.card-tag` card structure, `.loading-spinner` for the loading state, `.form-feedback` success/error banners, `.page-header-meta` count badge, and a disabled state for the submit button.

---

## Gotchas

**⚠️ Episodes API returns a WRAPPED response — not a plain array.**
Every page that shows an episode dropdown or displays episode data MUST deserialize via a wrapper DTO:

```csharp
// WRONG — will silently return null or throw:
var episodes = await Http.GetFromJsonAsync<List<EpisodeDto>>("api/episodes");

// CORRECT — Episodes controller returns { success, count, data[] }:
var response = await Http.GetFromJsonAsync<EpisodesApiResponse>("api/episodes");
var episodes = response?.Data?.ToList();

public class EpisodesApiResponse
{
    public bool Success { get; set; }
    public int Count { get; set; }
    public List<EpisodeDto> Data { get; set; }
}
```

All other controllers (`/api/characters`, `/api/quotes`, `/api/locations`, etc.) return plain arrays.

**`<style>` block is mandatory — every page must have one.** Do not finish step 9 without verifying the `<style>` block is present. Copy `templates/PageStyles.css.txt` in full and substitute placeholders. A page without styles will look completely unstyled.

**Null guards** — Blazor renders before `OnInitializedAsync` completes. Always null-check before iterating collections in markup.

**`@` escaping in `<style>`** — Write `@@media` not `@media` inside Razor `<style>` blocks.

**`@` in option text — use explicit parentheses.** When a `@` expression appears mid-word (e.g. `S@(episode.SeasonId)`), Razor cannot parse it without parentheses. Always use `@(expr)` form in option labels:
```html
<!-- WRONG — Razor can't parse S@expr mid-word: -->
<option>S@episode.SeasonId E@episode.EpisodeNumber: @episode.Title</option>

<!-- CORRECT — explicit parentheses for mid-word expressions: -->
<option>S@(episode.SeasonId) E@(episode.EpisodeNumber): @episode.Title</option>
```
Note: `@@` is ONLY for `<style>` blocks where `@` must be escaped to avoid being treated as CSS at-rules. In markup, `@@` outputs a literal `@`.

---

## Conventions

- Controllers inject `FanHubContext` directly — no services or repositories
- All async: `ToListAsync()`, `FindAsync()`, `SaveChangesAsync()`
- `ShowId = 1` for all seed records (Breaking Bad)
- POST returns `Ok(item)` with the created entity

---

## Checklist

- [ ] `FanHub.sln` project paths are correct (no `dotnet\dotnet\` duplicates)
- [ ] `dotnet build FanHub.sln` succeeds with 0 errors
- [ ] Migration ran; `GET /api/{entityNames}` returns seeded data
- [ ] `POST /api/{entityNames}` creates and returns a record
- [ ] Homepage stat card shows count
- [ ] Homepage nav card links to `/{entityNames}`
- [ ] `NavBar.razor` (not NavMenu.razor) includes the new nav link
- [ ] Correct template used (A or B)
- [ ] Template B: all FK fields are `<select>` dropdowns populated from the API
- [ ] Template B: cards display character name and episode tag in card footer
- [ ] No "0" values in form fields; proper placeholders shown
- [ ] `<style>` block is present at the bottom of the page (CSS from `PageStyles.css.txt` applied)
- [ ] CSS from `PageStyles.css.txt` applied — page looks polished
- [ ] Count badge shows in page header once data loads
- [ ] Cards animate in with staggered `fadeInUp` on page load
- [ ] Loading state shows spinner (not emoji)
- [ ] Submit button shows "Adding…" and is disabled while posting
- [ ] Success / error feedback message appears after form submit
- [ ] Adding an item inserts it at top and clears the form
- [ ] Empty state renders correctly with emoji icon
