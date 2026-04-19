---
name: create-card-and-page
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
6. **Show name** — for `{ShowName}` placeholder in header and card tags (e.g. `Breaking Bad`, `Peaky Blinders`)

Seed 12–15 records from the relevant universe doc in `fanhubdocs/`.

---

## Steps — complete all of them in order

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

### 8 — Header nav link (`dotnet/Frontend/Components/Layout/NavMenu.razor`)

Add alongside the existing `NavLink` items:

```html
<div class="nav-item px-3">
  <NavLink class="nav-link" href="{entityNames}">
    <span aria-hidden="true">{emoji}</span> {Plural Label}
  </NavLink>
</div>
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

**Null guards** — Blazor renders before `OnInitializedAsync` completes. Always null-check before iterating collections in markup.

**Wrapped API responses** — Episodes endpoint returns `{ success, count, data[] }`. Deserialize via an `ApiResponse<T>` wrapper DTO if needed.

**`@` escaping in `<style>`** — Write `@@media` not `@media` inside Razor `<style>` blocks.

**`@` in option text** — Use `S@@ep.SeasonId` for literal `@` characters in Razor markup.

---

## Conventions

- Controllers inject `FanHubContext` directly — no services or repositories
- All async: `ToListAsync()`, `FindAsync()`, `SaveChangesAsync()`
- `ShowId = 1` for all seed records (Breaking Bad)
- POST returns `Ok(item)` with the created entity

---

## Checklist

- [ ] Migration ran; `GET /api/{entityNames}` returns seeded data
- [ ] `POST /api/{entityNames}` creates and returns a record
- [ ] Homepage stat card shows count
- [ ] Homepage nav card links to `/{entityNames}`
- [ ] `NavMenu.razor` includes a `NavLink` for `/{entityNames}`
- [ ] Correct template used (A or B)
- [ ] Template B: all FK fields are `<select>` dropdowns populated from the API
- [ ] Template B: cards display character name and episode tag in card footer
- [ ] No "0" values in form fields; proper placeholders shown
- [ ] CSS from `PageStyles.css.txt` applied — page looks polished
- [ ] Count badge shows in page header once data loads
- [ ] Cards animate in with staggered `fadeInUp` on page load
- [ ] Loading state shows spinner (not emoji)
- [ ] Submit button shows "Adding…" and is disabled while posting
- [ ] Success / error feedback message appears after form submit
- [ ] Adding an item inserts it at top and clears the form
- [ ] Empty state renders correctly with emoji icon
