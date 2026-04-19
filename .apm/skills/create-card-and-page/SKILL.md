---
name: create-card-and-page
description: >
  Use this skill when asked to add a new entity type to FanHub. Always scaffolds the
  complete full-stack implementation: backend model, DbContext registration, seed data,
  EF Core migration, REST controller (GET + POST), frontend model, homepage summary card
  (showing counts) + nav-card, and a Blazor list page with an inline add form. Always
  include everything unless explicitly told otherwise.
---

## Create Card and Page Skill — FanHub Full-Stack Entity Scaffold

Use this skill whenever the user asks to add a new entity type (e.g. Locations, Factions, Themes, Quotes, etc.) to FanHub. The full stack is always built: backend, database migration, controller, frontend model, homepage integration (including a summary card that displays the count), and a card list page with add form.

---

## What to clarify before starting

If any of these are unclear from context, ask the user:

1. **Entity name** — singular PascalCase (e.g. `Location`, `Faction`, `Quote`)
2. **Core properties** — beyond `Id` and `ShowId`, what main fields? (e.g. `string Title`, `string Description`, `string Category`)
3. **Homepage label** — plural form for the stat card and nav card (e.g. "Locations", "Factions", "Quotes")
4. **Nav icon** — single emoji (e.g. 📍, ⚗️, 💬)
5. **Related entities** — Does this entity belong to (reference) another entity? (e.g. Quotes belong to Characters, Episodes; Locations belong to Seasons). If yes, ask which entity/entities and whether the relationship is required (user must select) or optional.

For everything else, make reasonable assumptions and proceed. Seed 12–15 records from `docs/breaking-bad-universe.md` by default.

---

## Implementation — Always Build the Full Stack

Follow these steps in order. Complete and verify each before moving to the next. Never skip steps or optionally include features — the full stack (backend + frontend + homepage + page) is always delivered.

### Step 1 — Backend model

Create `dotnet/Backend/Models/{EntityName}.cs`. Model properties:

- `int Id` (primary key)
- `int ShowId` (foreign key to show, always `1` for Breaking Bad)
- Core properties from the entity spec (e.g. `string Title`, `string Description`)
- **Foreign key properties** (if related): `int {RelatedEntity}Id` for each required relationship (e.g. `int CharacterId` for Quotes)
- No navigation properties
- All string properties non-nullable (no `?`)

**Example — Quote model with character relationship:**

```csharp
public class Quote
{
    public int Id { get; set; }
    public int ShowId { get; set; }
    public int CharacterId { get; set; }     // FK to Character
    public int EpisodeId { get; set; }       // FK to Episode
    public string QuoteText { get; set; }
    public bool IsFamous { get; set; }
    public int Likes { get; set; }
}
```

### Step 2 — Register DbSet in FanHubContext

Open `dotnet/Backend/Data/FanHubContext.cs` and add after the last `DbSet`:

```csharp
public DbSet<{EntityName}> {EntityName}s { get; set; }
```

No other changes to this file.

### Step 3 — Seed data

In `dotnet/Backend/Data/SeedData.cs`, add a new seed block after the last existing seed block:

```csharp
var {entityNames} = new[]
{
    new {EntityName}
    {
        ShowId = 1,
        Title = "...",
        Description = "...",
        // ... other properties
    },
    // ... 12–15 total records
};
context.{EntityName}s.AddRange({entityNames});
context.SaveChanges();
```

All records use `ShowId = 1`. Draw content from `docs/breaking-bad-universe.md`.

### Step 4 — EF migration

In `dotnet/Backend/` terminal:

```bash
dotnet ef migrations add Add{EntityName}
dotnet ef database update
```

Stop if migration fails. Fix and retry before continuing.

### Step 5 — Backend controller

Create `dotnet/Backend/Controllers/{EntityName}Controller.cs`:

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class {EntityName}sController : ControllerBase
{
    private readonly FanHubContext _context;

    public {EntityName}sController(FanHubContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get{EntityName}s()
    {
        var items = await _context.{EntityName}s.ToListAsync();
        return Ok(items);
    }

    [HttpPost]
    public async Task<IActionResult> Create{EntityName}([FromBody] {EntityName} item)
    {
        _context.{EntityName}s.Add(item);
        await _context.SaveChangesAsync();
        return Ok(item);
    }
}
```

### Step 6 — Frontend model

Create `dotnet/Frontend/Models/{EntityName}.cs`. Mirror the backend model exactly:

```csharp
namespace Frontend.Models;

public class {EntityName}
{
    public int Id { get; set; }
    public int ShowId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    // ... other properties, same names and types as backend
}
```

### Step 7 — Add Summary Card to Home.razor (count display)

**Always add this.** The summary card displays the count of all entities of this type on the homepage.

In `dotnet/Frontend/Components/Pages/Home.razor`, in the `@code` block, add:

```csharp
private int {entityName}Count;
```

Inside `OnInitializedAsync()`, add:

```csharp
var {entityName}List = await Http.GetFromJsonAsync<List<{EntityName}>>("api/{entityNames}");
{entityName}Count = {entityName}List?.Count ?? 0;
```

In the `<div class="summary-card">` section, add a new `<div class="summary-stat">` block after the last existing stat:

```html
<div class="summary-stat">
  <span class="stat-number">@{entityName}Count</span>
  <span class="stat-label">{Plural Label}</span>
</div>
```

### Step 8 — Add nav card to Home.razor

In the `<section class="nav-cards">`, add after the last `<a class="nav-card">`:

```html
<a href="/{entityNames}" class="nav-card">
  <div class="nav-card-icon">{emoji}</div>
  <h2>{Plural Label}</h2>
  <p>{One-sentence description}</p>
  <span class="nav-card-cta">View {Plural Label} →</span>
</a>
```

---

## Step 9 — Choose the Correct Form Template

**Determine which template to use:**

- **Template A (Simple form)** — Use if the entity has NO foreign keys to other entities beyond ShowId (e.g., Locations, Factions, Themes)
- **Template B (Dropdown form)** — Use if the entity has required foreign keys (e.g., Quotes has CharacterId and EpisodeId, Season events have SeasonId, etc.)

**Key difference:**

- Template A: User types/enters data directly
- Template B: User selects related entities from dropdowns populated from the API

### Step 9a — Template A: Simple Form (No Related Entities)

If your entity has NO required relationships to other entities, use this template:

**📄 Template file:** `templates/TemplateA_SimpleForm.razor.txt`

The template includes:

- Page header with gradient background and green accent
- Add form with header, form groups, labels, and submission
- Empty state displays (loading, no items)
- Entity grid with card display
- Professional styling with hover effects and focus states
- All required `@code` section with async data loading

### Step 9b — Template B: Form with Dropdowns (Has Related Entities)

If your entity has required foreign keys to other entities (e.g., Quotes have CharacterId, EpisodeId), use this template:

**📄 Template file:** `templates/TemplateB_DropdownForm.razor.txt`

The template includes:

- All features from Template A plus:
- Dropdown selects for related entities (e.g., Character, Episode)
- Parallel async loading of related entities in `OnInitializedAsync()`
- DTO classes for minimal related entity data
- Nullable `int?` properties for foreign keys
- Validation checking `.HasValue` before submission
- User-friendly display formats in dropdown options (e.g., "S1 E1: Pilot")

**CSS Styling:**

**📄 Stylesheet file:** `templates/PageStyles.css.txt`

Copy the entire CSS file into a `<style>` block at the bottom of your Razor component. The stylesheet includes:

- **Page header** — Gradient background, green accent border, responsive typography
- **Form section** — Grid layout, labels, form groups, focus states, custom dropdown styling
- **Submit button** — Green background with hover lift effect and shadow
- **Empty states** — Centered layout with emoji icons and messaging
- **Card grid** — Responsive CSS Grid that stacks on mobile, hover effects with elevation
- **Professional styling** — Smooth transitions, color scheme matching FanHub theme (#62d962 green)

All CSS uses placeholder classnames like `.{entityNames}-page`, `.{entityName}-card` that you'll replace with your actual entity name.

**Key form design principles:**

1. **Numeric fields** — Use `int?` (nullable) instead of `int` to avoid displaying "0" in the field. Check `HasValue` before using.
2. **Placeholders** — Use the HTML `placeholder` attribute for watermark text; avoid displaying bound data by default.
3. **Layout** — Use CSS Grid for responsive form layout that stacks on mobile.
4. **Clear visual hierarchy** — Distinct add-form section, loading states, empty state messages, and beautiful card grid.
5. **Professional styling** — Match FanHub's dark/green theme; add hover effects, focus states, and smooth transitions.
6. **Error handling** — Wrap POST logic in try-catch; validate before submission.

---

## Server-Side Rendering (SSR) Gotchas

These issues occur during page load and must be handled:

### Null Collection Guards During Initial Render

When using Blazor with InteractiveServer, components render on the server BEFORE `OnInitializedAsync()` completes. Collections are `null` during this initial render, causing `NullReferenceException` if you try to iterate over them.

**✅ Solution:** Always null-check collections in markup:

```razor
@if (characters != null)
{
    @foreach (var character in characters)
    {
        <option value="@character.Id">@character.Name</option>
    }
}
```

If the form needs data before submission, wrap the entire form in a loading check:

```razor
@if (isLoading)
{
    <p>Loading form data...</p>
}
else
{
    <form @onsubmit="HandleSubmit">
        <!-- form content -->
    </form>
}
```

### Wrapped API Response Handling

Some FanHub endpoints return wrapped responses: `{ success: bool, count: int, data: T[] }` (e.g., Episodes).
Others return plain lists. Always check the actual API response format.

**✅ Solution:** If the endpoint returns a wrapped response, deserialize to a DTO:

```csharp
private class ApiResponse<T>
{
    public bool Success { get; set; }
    public int Count { get; set; }
    public List<T> Data { get; set; }
}

// Then in OnInitializedAsync:
var response = await Http.GetFromJsonAsync<ApiResponse<Episode>>("api/episodes");
episodes = response?.Data;
```

### Razor `@` Symbol Escaping in String Interpolation

In Razor markup, the `@` symbol is special. String interpolation like `S@episode.SeasonId` conflicts with Razor syntax.

**✅ Solution:** Double the `@` symbol:

```razor
<option value="@ep.Id">S@@ep.SeasonId E@@ep.EpisodeNumber: @ep.Title</option>
```

Or use string concatenation in the code block:

```csharp
private string FormatEpisode(Episode ep) => $"S{ep.SeasonId} E{ep.EpisodeNumber}: {ep.Title}";
```

Then use it in markup:

```razor
<option value="@ep.Id">@FormatEpisode(ep)</option>
```

---

## Key Conventions

- No repository pattern — controllers inject `FanHubContext` directly
- No authentication or authorization
- No DTO layer — use models directly
- Async methods: `FindAsync()`, `ToListAsync()`, `SaveChangesAsync()`
- Frontend data fetch: `await Http.GetFromJsonAsync<T>("api/endpoint")`
- POST controller action returns `Ok(item)` with the created entity
- All entities reference `ShowId = 1` (Breaking Bad)

## Frontend Form Best Practices

**When to use dropdowns for related entities** — If your entity has foreign keys to other entities (e.g., Quotes → Characters, Episodes), **always use dropdowns** instead of numeric input fields. This improves UX by:

- Showing user-friendly names instead of IDs
- Preventing invalid foreign key references
- Making it obvious which options are available
- Matching FanHub's professional design patterns

**Related entity pattern (Template B):**

1. Fetch all available related entities in `OnInitializedAsync()` using parallel tasks
2. Populate dropdowns with the fetched data
3. Use nullable `int?` for the selected value
4. Validate that the user selected something before submission
5. Display user-friendly text in options (e.g., "S1 E1: Pilot" for episodes, "Walter White" for characters)

**Numeric input fields issue** — When binding `int` properties to `<input type="number">` fields, the default value of `0` displays, replacing placeholder text. **Solution**: Use `int?` (nullable int) instead.

```csharp
// ❌ DO NOT — shows "0" in the field
private int newCharacterId;
<input type="number" @bind="newCharacterId" placeholder="Character ID" />

// ✅ DO THIS — field stays empty until user types
private int? newCharacterId;
<input type="number" @bind="newCharacterId" placeholder="Character ID" />

// ✅ BETTER — use dropdown instead (Template B)
<select @bind="newCharacterId">
    <option value="">-- Select Character --</option>
    @foreach (var character in availableCharacters)
    {
        <option value="@character.Id">@character.Name</option>
    }
</select>
```

**Form styling** — Always use the professional template provided in Step 9a or 9b. They include:

- Responsive grid layout that stacks on mobile
- Proper focus states with visual feedback (green glow)
- Custom dropdown styling with arrow icon
- FanHub brand colors (green #62d962, dark background)
- Hover effects and smooth transitions
- Empty state and loading messages
- Beautiful card grid with depth

---

## Verification Checklist

After completing all 9 steps:

- [ ] Backend compiles without errors
- [ ] Migration succeeds and updates the database
- [ ] `GET /api/{entitynames}` returns the seeded records
- [ ] `POST /api/{entitynames}` creates a new record and returns it
- [ ] Homepage displays the new **summary card** showing the entity count
- [ ] Homepage displays the new nav card linking to `/{entitynames}`
- [ ] Navigating to `/{entitynames}` displays the page header with proper styling
- [ ] The add-form looks professional (clean fields, no "0" values, proper placeholders)
- [ ] **If using Template A**: Form has simple input fields for direct data entry
- [ ] **If using Template B**: All required related entity dropdowns are populated and functional
- [ ] **If using Template B**: Dropdown options display user-friendly text (names, formatted IDs, etc.)
- [ ] **If using Template B**: Parallel data loading works (all related data loads efficiently)
- [ ] Form fields are responsive and stack on mobile
- [ ] Cards display in a beautiful responsive grid
- [ ] Adding a new item via the form inserts it at the top and clears the form
- [ ] Empty state message shows when no items exist
- [ ] Loading state shows while fetching data
- [ ] Hover effects work on cards and buttons
- [ ] Focus states work on all form inputs (border turns green, glow appears)
- [ ] The summary card count updates after adding new items
- [ ] No existing pages or routes are broken
