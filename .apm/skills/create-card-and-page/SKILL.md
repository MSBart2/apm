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

1. **Entity name** — singular PascalCase (e.g. `Location`, `Faction`, `Theme`)
2. **Core properties** — beyond `Id` and `ShowId`, what main fields? (e.g. `string Title`, `string Description`, `string Category`)
3. **Homepage label** — plural form for the stat card and nav card (e.g. "Locations", "Factions")
4. **Nav icon** — single emoji (e.g. 📍, ⚗️, 🎭)

For everything else, make reasonable assumptions and proceed. Seed 12–15 records from `docs/breaking-bad-universe.md` by default.

---

## Implementation — Always Build the Full Stack

Follow these steps in order. Complete and verify each before moving to the next. Never skip steps or optionally include features — the full stack (backend + frontend + homepage + page) is always delivered.

### Step 1 — Backend model

Create `dotnet/Backend/Models/{EntityName}.cs`. Model properties:

- `int Id` (primary key)
- `int ShowId` (foreign key to show, always `1` for Breaking Bad)
- Core properties from the entity spec (e.g. `string Title`, `string Description`)
- No navigation properties
- All string properties non-nullable (no `?`)

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

### Step 9 — Create list page with form

Create `dotnet/Frontend/Components/Pages/{EntityName}.razor`. Minimum structure:

```razor
@page "/{entityNames}"
@rendermode InteractiveServer
@inject HttpClient Http
@using Frontend.Models

<PageTitle>{Plural Label} - FanHub</PageTitle>

<div class="page-header">
    <div class="page-header-label">FanHub</div>
    <h1>{Plural Label}</h1>
</div>

<div class="add-form">
    <h2>Add New {EntityName}</h2>
    <form @onsubmit="HandleSubmit" @onsubmit:preventDefault>
        <input @bind="newTitle" placeholder="Title" />
        <textarea @bind="newDescription" placeholder="Description"></textarea>
        <button type="submit">Add</button>
    </form>
</div>

@if ({entityNames} == null)
{
    <p>Loading...</p>
}
else
{
    <div class="grid">
        @foreach (var item in {entityNames})
        {
            <div class="card">
                <h3>@item.Title</h3>
                <p>@item.Description</p>
            </div>
        }
    </div>
}

@code {
    private List<{EntityName}>? {entityNames};
    private string newTitle = string.Empty;
    private string newDescription = string.Empty;

    protected override async Task OnInitializedAsync()
    {
        {entityNames} = await Http.GetFromJsonAsync<List<{EntityName}>>("api/{entityNames}");
    }

    private async Task HandleSubmit()
    {
        var newItem = new {EntityName}
        {
            ShowId = 1,
            Title = newTitle,
            Description = newDescription
        };

        var response = await Http.PostAsJsonAsync("api/{entityNames}", newItem);
        var created = await response.Content.ReadFromJsonAsync<{EntityName}>();

        if (created != null)
        {
            {entityNames} ??= new List<{EntityName}>();
            {entityNames}.Add(created);
        }

        newTitle = string.Empty;
        newDescription = string.Empty;
    }
}
```

Adjust the form fields and card markup to match actual properties.

---

## Key Conventions

- No repository pattern — controllers inject `FanHubContext` directly
- No authentication or authorization
- No DTO layer — use models directly
- Async methods: `FindAsync()`, `ToListAsync()`, `SaveChangesAsync()`
- Frontend data fetch: `await Http.GetFromJsonAsync<T>("api/endpoint")`
- POST controller action returns `Ok(item)` with the created entity
- All entities reference `ShowId = 1` (Breaking Bad)

---

## Verification Checklist

After completing all 9 steps:

- [ ] Backend compiles without errors
- [ ] Migration succeeds and updates the database
- [ ] `GET /api/{entitynames}` returns the seeded records
- [ ] `POST /api/{entitynames}` creates a new record and returns it
- [ ] Homepage displays the new **summary card** showing the entity count
- [ ] Homepage displays the new nav card linking to `/{entitynames}`
- [ ] Navigating to `/{entitynames}` displays the card grid
- [ ] Adding a new item via the form adds it to the grid in real time
- [ ] The summary card count updates after adding new items
- [ ] No existing pages or routes are broken
