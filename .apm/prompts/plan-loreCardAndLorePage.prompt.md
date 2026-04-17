## Plan: Lore Card + `/lore` Page

Add a "Lore Facts" stat and nav-card to the homepage, backed by a new `Lore` entity seeded from `.github/instructions/breaking-bad-universe.instructions.md`. The `/lore` page displays lore in a card grid with an inline add form.

---

### Phase 1 — Backend Model & DB

**1. Create `Lore` model** — new file `dotnet/Backend/Models/Lore.cs`

- Properties: `Id` (int), `ShowId` (int), `Title` (string), `Description` (string), `Category` (string)
- Match the POCO style of `Character.cs` — no data annotations, no navigation properties

**2. Register DbSet** — `dotnet/Backend/Data/FanHubContext.cs`

- Add `public DbSet<Lore> Lores { get; set; }` alongside existing DbSets

**3. Add seed data** — `dotnet/Backend/Data/SeedData.cs`

- ⚠️ The existing `if (context.Shows.Any()) return;` early-exits before any new code — the Lore seed block must be placed **before** that `return`, with its own guard: `if (!context.Lores.Any()) { /* seed lore */ }`
- Seed ~12–15 facts from `.github/instructions/breaking-bad-universe.instructions.md` across 5 categories: Location, Faction, Theme, Story Beat, Production — all with `ShowId = show.Id` (fetched via `context.Shows.First()`)

**4. Run EF migration** _(developer step, not a code change)_

- `dotnet ef migrations add AddLore` in `dotnet/Backend/`
- `dotnet ef database update`
- ⚠️ Per repo memory: if a `fanhub.db` exists from `EnsureCreated`, delete it first or the migration will conflict

---

### Phase 2 — Backend Controller

**5. Create `LoreController`** — new file `dotnet/Backend/Controllers/LoreController.cs`

- Copy structure from `QuotesController.cs` exactly
- `GET /api/lore` → `await _context.Lores.ToListAsync()` → `Ok(list)`
- `POST /api/lore` → `[FromBody] Lore lore`, Add + SaveChangesAsync → `Ok(lore)`
- No extra endpoints

---

### Phase 3 — Frontend Display

**6. Update `NavBar.razor`** — `dotnet/Frontend/Components/Layout/NavBar.razor`

- Add `<li><a href="/lore">Lore</a></li>` after the Episodes `<li>` in the `nav-links` `<ul>`
- No other changes — NavBar uses plain `<a>` tags, not Blazor `<NavLink>`, so no `Match` attribute needed

**7. Update `Home.razor`** — two additions:

- In `summary-card`: add a new `<div class="summary-stat">` with `@loreCount` / "Lore Facts" — fetch in `OnInitializedAsync` via `Http.GetFromJsonAsync<List<LoreDto>>("api/lore")`, set `loreCount = list?.Count ?? 0`
- In `nav-cards` section: add `<a href="/lore" class="nav-card">` with icon 📖, title "Lore", description, and `nav-card-cta`
- Add `LoreDto` inner class to `@code` block with `Id`, `ShowId`, `Title`, `Description`, `Category`

**8. Create `Lore.razor`** — new file `dotnet/Frontend/Components/Pages/Lore.razor`

- `@page "/lore"`, `@inject HttpClient Http`
- `OnInitializedAsync`: fetches `api/lore` into `List<LoreDto> lores`
- **Page header** — match the `Characters.razor` `.page-header` pattern: dark gradient banner (`linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)`), green left-border accent, `.page-header-label` ("Breaking Bad Universe"), `<h1>Lore</h1>`, `.page-subtitle`
- **Card grid** — CSS grid (`repeat(auto-fill, minmax(280px, 1fr))`), each card: white background, `border-top: 3px solid #62d962`, category badge (small caps, green), `Title` as heading, `Description` as body text — match the visual style of Characters cards
- **Add form** — styled panel below the grid with labeled inputs matching the app's green-accent theme
- All styles scoped in a `<style>` block within the component (matches every other page)

---

### Phase 4 — Frontend Add Form

**9. Add form to `Lore.razor`** _(part of Step 8 file)_

- Plain `<form @onsubmit="HandleSubmit" @onsubmit:preventDefault>` — no `<EditForm>` (not used anywhere in codebase)
- Bound fields: `<input @bind="newTitle">`, `<textarea @bind="newDescription">`
- `HandleSubmit()` posts `new LoreDto { Title=newTitle, Description=newDescription, ShowId=1, Category="Custom" }` via `Http.PostAsJsonAsync("api/lore", ...)`
- On success: deserialize response to `LoreDto`, append to `lores` list, clear `newTitle`/`newDescription`, call `StateHasChanged()`

---

### Relevant Files

| File                                             | Change                                              |
| ------------------------------------------------ | --------------------------------------------------- |
| `dotnet/Backend/Models/Lore.cs`                  | **New**                                             |
| `dotnet/Backend/Data/FanHubContext.cs`           | Add `DbSet<Lore>`                                   |
| `dotnet/Backend/Data/SeedData.cs`                | Add separate `if (!context.Lores.Any())` seed block |
| `dotnet/Backend/Controllers/LoreController.cs`   | **New** — GET + POST                                |
| `dotnet/Frontend/Components/Layout/NavBar.razor` | Add Lore `<li>` nav link                            |
| `dotnet/Frontend/Components/Pages/Home.razor`    | Add stat + nav-card + `LoreDto` inner class         |
| `dotnet/Frontend/Components/Pages/Lore.razor`    | **New** — page header, card grid, add form          |

---

### Verification

1. `dotnet ef migrations add AddLore` succeeds
2. `dotnet ef database update` applies cleanly (delete `fanhub.db` first if needed)
3. `GET /api/lore` returns JSON array of 12–15 seeded facts
4. `POST /api/lore` with `{"title":"Test","description":"desc","category":"Custom","showId":1}` returns object with new `Id`
5. Home page shows "Lore Facts" count in stat row and 📖 Lore nav-card
6. Clicking nav-card navigates to `/lore` and renders card grid
7. Fill form + submit → new card appears immediately without page reload
8. Navigate back to `/` → count incremented by 1

---

### Decisions

- No `Models/` folder in Frontend — `LoreDto` defined inline in `@code` block (matches existing pattern)
- Separate seed guard (`if (!context.Lores.Any())`) so lore seeds into already-initialized DBs
- `Category` defaults to `"Custom"` for user-submitted entries; form only exposes Title + Description
- No auth on endpoints (matches all existing controllers)
- No Lore detail page or modal (not in scope)
