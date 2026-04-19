# FanHub Frontend Architecture

> Deep-dive reference for `dotnet/Frontend/`. For backend details see [`backend-architecture.md`](backend-architecture.md). For project overview see [`AGENTS.md`](../AGENTS.md).

---

## Stack

| Layer    | Technology                    | Notes                                 |
| -------- | ----------------------------- | ------------------------------------- |
| Frontend | Blazor Server                 | `dotnet/Frontend/`                    |
| Render   | Interactive Server Components | `@rendermode InteractiveServer`       |
| HTTP     | `HttpClient`                  | Injected via DI, base URL from config |

---

## Build & Run

```bash
cd dotnet/Frontend
dotnet restore
dotnet run                    # http://localhost:3000
```

Backend must be running at `http://localhost:5265` for API calls to succeed.

---

## Directory Structure

```
dotnet/Frontend/
├── Components/
│   ├── App.razor
│   ├── Routes.razor
│   ├── _Imports.razor
│   ├── Layout/
│   │   ├── MainLayout.razor
│   │   ├── MainLayout.razor.css
│   │   ├── NavBar.razor
│   │   ├── NavMenu.razor
│   │   ├── NavMenu.razor.css
│   │   ├── ReconnectModal.razor
│   │   ├── ReconnectModal.razor.css
│   │   └── ReconnectModal.razor.js
│   └── Pages/
│       ├── Home.razor          # Hero section, stat cards, nav-cards, Quote of the Day
│       ├── Characters.razor    # Character grid + inline detail panel
│       ├── Episodes.razor      # Episode list with season dropdown filter
│       ├── Error.razor         # Error page
│       └── NotFound.razor      # 404 page
├── Models/                     # C# mirror of backend models — no EF attributes
├── wwwroot/                    # Static assets
├── appsettings.json
├── appsettings.Development.json  # BackendUrl: http://localhost:5265
├── Frontend.csproj
└── Program.cs
```

> **Note**: There is no `Lore.razor` page. Lore is not implemented in the frontend.

---

## Program.cs Bootstrap

```csharp
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

// BackendUrl read from appsettings.Development.json — defaults to http://localhost:5265
var backendUrl = builder.Configuration["BackendUrl"] ?? "http://localhost:5265";
builder.Services.AddHttpClient("default", client => client.BaseAddress = new Uri(backendUrl));
builder.Services.AddScoped(sp =>
    sp.GetRequiredService<IHttpClientFactory>().CreateClient("default"));

app.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);
app.UseAntiforgery();
app.MapStaticAssets();
app.MapRazorComponents<App>().AddInteractiveServerRenderMode();
```

---

## Configuration

| Setting     | File                             | Key          | Default                 |
| ----------- | -------------------------------- | ------------ | ----------------------- |
| Backend URL | `appsettings.Development.json`   | `BackendUrl` | `http://localhost:5265` |
| Port        | `Properties/launchSettings.json` | —            | `3000`                  |

---

## HttpClient Usage

`HttpClient` is injected into Razor pages via `@inject HttpClient Http`. The base address is set to `BackendUrl` so all fetch paths are relative:

```razor
@inject HttpClient Http
```

### Fetch Patterns

```csharp
// GET list
var items = await Http.GetFromJsonAsync<List<T>>("api/endpoint");
// or array:
var items = await Http.GetFromJsonAsync<T[]>("api/endpoint");

// POST
var response = await Http.PostAsJsonAsync("api/endpoint", payload);
var created = await response.Content.ReadFromJsonAsync<T>();
```

> **EpisodesController exception**: The backend wraps episode responses in `{ success, count, data }`. The frontend must deserialize the `data` field, not a plain array.

---

## Component Conventions

- `@rendermode InteractiveServer` — required on all interactive pages (those with `@code` blocks that handle events or load data)
- `@using Frontend.Models` — model namespace for all pages (or declared globally in `_Imports.razor`)
- **No `<EditForm>`** — forms use plain HTML: `<form @onsubmit="Handler" @onsubmit:preventDefault>`
- **No full re-fetch after mutation** — after adding/updating an item, mutate the in-memory list and call `StateHasChanged()`
- **No authentication checks** on any frontend route — all pages are publicly accessible
- **No navigation guards** — no route-level `[Authorize]` or redirect logic

### Page `@code` Block Pattern

```csharp
@code {
    private T[]? items;

    protected override async Task OnInitializedAsync()
    {
        await LoadItems();
    }

    private async Task LoadItems()
    {
        items = await Http.GetFromJsonAsync<T[]>("api/endpoint");
    }
}
```

---

## Pages Reference

### Home.razor (`/`)

- Hero banner with FanHub logo and Breaking Bad title
- Stat cards: hardcoded "5 Seasons", "62 Episodes", "AMC Network" + live `characterCount` fetched from API
- Quote of the Day: fetches `/api/quotes`, picks a random entry, fetches character name separately
- Nav-cards linking to `/characters` and `/episodes`

### Characters.razor (`/characters`)

- `@rendermode InteractiveServer`
- Fetches `Character[]` from `api/characters` in `OnInitializedAsync`
- Grid of character cards; clicking a card sets `selectedCharacter` and shows an inline detail panel
- Uses a **static event** `OnCharacterSelected` — **never unsubscribed** (memory leak bug)
- Bio truncated to 100 chars in card view: `character.Bio?.Length > 100 ? character.Bio.Substring(0, 100) : character.Bio`

### Episodes.razor (`/episodes`)

- `@rendermode InteractiveServer`
- Season dropdown: options hardcoded as 1–5 (not fetched from API)
- Fetches `Episode[]` from `api/episodes` or `api/episodes?season={n}`
- **Caching bug**: `cachedEpisodes` field stores all episodes on first load; season filter change does NOT re-fetch — returns cached full list regardless of selection

---

## Frontend Models

Located in `dotnet/Frontend/Models/`. These are plain C# classes that mirror backend models — **no EF Core attributes, no `[Required]`**. Used only for JSON deserialization.

```csharp
// mirrors Backend.Models — same property names and types
Character  { Id, ShowId, Name, ActorName, Bio, Tagline, CharacterType,
             IsMainCharacter, Status, ImageUrl }

Show       { Id, Title, Description, Genre, StartYear, EndYear, Network }

Episode    { Id, ShowId, SeasonId, EpisodeNumber, Title, Description,
             RuntimeMinutes, AirDate }

Season     { Id, ShowId, SeasonNumber, Title, EpisodeCount }

Quote      { Id, ShowId, CharacterId, EpisodeId, QuoteText, IsFamous, Likes }
```

---

## Known Frontend Bugs

| Bug                             | Location           | Issue                                                                                                                     |
| ------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Season filter ignored           | `Episodes.razor`   | `cachedEpisodes` returns all episodes regardless of selected season                                                       |
| Static event never unsubscribed | `Characters.razor` | `OnCharacterSelected` is `static` and never removed in `Dispose` — memory leak on every navigation                        |
| Bio substring crash             | `Characters.razor` | `character.Bio?.Length > 100` uses `?.` but then calls `.Substring()` on potentially null — appends `...` unconditionally |
| Hardcoded season options        | `Episodes.razor`   | Season dropdown is hardcoded 1–5 rather than fetched from `api/seasons`                                                   |
| No Lore page                    | —                  | Lore nav-card or link would 404 — Lore page does not exist                                                                |

---

## Related Docs

| Document                                                        | Purpose                                         |
| --------------------------------------------------------------- | ----------------------------------------------- |
| [`fanhubdocs/backend-architecture.md`](backend-architecture.md) | Backend API, models, EF Core, seeding, bugs     |
| [`dotnet/BUGS.md`](../dotnet/BUGS.md)                           | Full bug catalog with evidence and fix guidance |
| [`dotnet/SETUP.md`](../dotnet/SETUP.md)                         | Detailed setup instructions                     |
