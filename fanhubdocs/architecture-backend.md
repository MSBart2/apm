# FanHub Backend Architecture

> Deep-dive reference for `dotnet/Backend/`. For frontend details see [`frontend-architecture.md`](frontend-architecture.md). For project overview see [`AGENTS.md`](../AGENTS.md).

---

## Stack

| Layer    | Technology               | Notes                                                  |
| -------- | ------------------------ | ------------------------------------------------------ |
| API      | ASP.NET Core 10 Web API  | `dotnet/Backend/`                                      |
| Database | SQLite via EF Core 10    | File: `fanhub.db` in `dotnet/Backend/`                 |
| ORM      | Entity Framework Core 10 | Direct `FanHubContext` injection — no repository layer |
| Auth     | Stub only                | `AuthController` exists but middleware not enforced    |

---

## Build & Run

```bash
cd dotnet/Backend
dotnet restore
dotnet ef database update     # applies migrations, creates fanhub.db
dotnet run                    # http://localhost:5265

# Tests
cd dotnet/Backend.Tests
dotnet test

# Docker
cd dotnet
docker compose up -d
```

---

## Directory Structure

```
dotnet/Backend/
├── Controllers/
│   ├── AuthController.cs
│   ├── CharactersController.cs
│   ├── EpisodesController.cs
│   ├── QuotesController.cs
│   └── ShowsController.cs
├── Data/
│   ├── FanHubContext.cs      # DbContext — DbSet registrations, no OnModelCreating
│   └── SeedData.cs           # Seeding — runs on every startup via SeedData.Initialize(context)
├── Migrations/
│   └── 20260327003316_InitialCreate.cs   # Only migration — full baseline schema
├── Models/
│   ├── Character.cs
│   ├── CharacterRelationship.cs
│   ├── Episode.cs
│   ├── Quote.cs
│   ├── Season.cs
│   ├── Show.cs
│   └── User.cs
├── Properties/
│   └── launchSettings.json   # Port: 5265
├── appsettings.json
├── appsettings.Development.json
└── Program.cs                # Service registration, CORS, seeding bootstrap
```

> **Note**: There is no `LoreController.cs` and no `Lore.cs` model. Lore does not currently exist as a backend feature despite being referenced in some older docs.

---

## Program.cs Bootstrap

```csharp
// Service registration
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// BUG: Connection string hardcoded — should use builder.Configuration.GetConnectionString()
builder.Services.AddDbContext<FanHubContext>(options =>
    options.UseSqlite("Data Source=fanhub.db"));

// BUG: CORS wide open
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll",
        b => b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

// Seeding runs on every startup
using (var scope = app.Services.CreateScope()) {
    var context = scope.ServiceProvider.GetRequiredService<FanHubContext>();
    SeedData.Initialize(context);
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();
```

---

## API Routes

| Controller             | Route             | Endpoints                                               |
| ---------------------- | ----------------- | ------------------------------------------------------- |
| `CharactersController` | `/api/characters` | GET (list), GET `{id}`, POST, PUT `{id}`, DELETE `{id}` |
| `ShowsController`      | `/api/shows`      | GET (list), GET `{id}`, POST, PUT `{id}`, DELETE `{id}` |
| `EpisodesController`   | `/api/episodes`   | GET (`?season={id}` optional), GET `{id}`, POST         |
| `QuotesController`     | `/api/quotes`     | GET (list), GET `{id}`, POST, POST `{id}/like`          |
| `AuthController`       | `/api/auth`       | POST `/register`, POST `/login`                         |

> **Note**: There is no `/api/lore` endpoint. `QuotesController` has no DELETE endpoint.

---

## Coding Conventions

- **Namespace**: `Backend.Controllers`, `Backend.Models`, `Backend.Data`
- **Route attribute**: `[Route("api/[controller]")]` — controller class name minus `Controller` suffix = route segment
- **Controller file naming**: `{Entity}Controller.cs`
- **Async pattern**: `FindAsync()`, `ToListAsync()`, `SaveChangesAsync()`
- **No repository pattern** — controllers inject `FanHubContext _context` directly via constructor
- **No services layer** — all logic is inline in controller action methods
- **No authentication middleware** — `AuthController` is a stub; `[Authorize]` is never used anywhere

### Standard Controller Shape

```csharp
[ApiController]
[Route("api/[controller]")]
public class {Entity}Controller : ControllerBase
{
    private readonly FanHubContext _context;

    public {Entity}Controller(FanHubContext context) { _context = context; }

    [HttpGet]         public async Task<IActionResult> Get{Entities}() { ... }
    [HttpGet("{id}")] public async Task<IActionResult> Get{Entity}(int id) { ... }
    [HttpPost]        public async Task<IActionResult> Create{Entity}({Entity} entity) { ... }
    [HttpPut("{id}")] public async Task<IActionResult> Update{Entity}(int id, {Entity} entity) { ... }
    [HttpDelete("{id}")] public async Task<IActionResult> Delete{Entity}(int id) { ... }
}
```

### EpisodesController Deviation

`EpisodesController` wraps its GET list response in an envelope object — inconsistent with all other controllers:

```csharp
return Ok(new { success = true, count = episodes.Count, data = episodes });
```

Also exposes `ex.StackTrace` in 500 responses. Also: `_context` is NOT `readonly` (missing keyword).

---

## FanHubContext

```csharp
// dotnet/Backend/Data/FanHubContext.cs
public class FanHubContext : DbContext
{
    public FanHubContext(DbContextOptions<FanHubContext> options) : base(options) { }

    public DbSet<Show> Shows { get; set; }
    public DbSet<Character> Characters { get; set; }
    public DbSet<Episode> Episodes { get; set; }
    public DbSet<Season> Seasons { get; set; }
    public DbSet<Quote> Quotes { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<CharacterRelationship> CharacterRelationships { get; set; }

    // OnModelCreating is NOT overridden — no FK relationships, cascade rules, or indexes configured
}
```

> Navigation properties exist on models but are **not configured** — EF Core will not load them automatically. No `.Include()` calls are needed to avoid null navprops; they will simply always be null unless explicitly loaded.

---

## Models Reference

All models are in `Backend.Models` namespace. All string properties are **non-nullable**. No `[Required]`, `[MaxLength]`, or `[EmailAddress]` attributes are applied anywhere (intentional omission — missing validation is a known bug).

```csharp
Character  { Id, ShowId, Name, ActorName, Bio, Tagline, CharacterType,
             IsMainCharacter, Status, ImageUrl? }
             // Navigation: Show (not virtual — lazy loading won't work)
             // Missing navprops: Quotes, Episodes

Show       { Id, Title, Description, Genre, StartYear, EndYear?, Network }
             // No navigation properties at all

Episode    { Id, ShowId, SeasonId, EpisodeNumber, Title, Description,
             RuntimeMinutes, AirDate }
             // Navigation: Season
             // [NotMapped] Characters — not a DB column
             // Missing navprop: Show

Season     { Id, ShowId, SeasonNumber, Title, EpisodeCount }
             // No navigation properties

Quote      { Id, ShowId, CharacterId, EpisodeId, QuoteText, IsFamous, Likes }
             // Navigation: Character (inconsistent — missing Show, Episode navprops)

User       { Id, Email, PasswordHash, Username, DisplayName, Role }
             // Role is plain string — not an enum

CharacterRelationship  { Id, CharacterId, RelatedCharacterId, RelationshipType? }
             // No navigation properties
```

---

## Seed Data

`SeedData.Initialize(context)` is called in `Program.cs` on every startup. Each block is guarded by an `Any()` check to prevent re-seeding if data already exists.

Seeded in order:

1. `Show` — 1 record (Breaking Bad, Id=1)
2. `Seasons` — 5 records (Season 1–5, Ids 1–5)
3. `Episodes` — 62 records
4. `Characters` — main and supporting cast
5. `Quotes` — famous quotes
6. `CharacterRelationships` — relationship graph

> **Known bug**: Jesse Pinkman is inserted **twice** in `SeedData.cs` (at indices 1 and 4, different `Id` values). One quote references the duplicate entry by its second `Id`.

---

## EF Migrations

Migrations live in `dotnet/Backend/Migrations/`. Only **one migration** exists:

- `20260327003316_InitialCreate` — full baseline schema for all tables

To add a migration after a model change:

```bash
cd dotnet/Backend
dotnet ef migrations add Add{EntityName}
dotnet ef database update
```

> The database file `fanhub.db` is created in `dotnet/Backend/` when you run `dotnet ef database update`. If `fanhub.db` already exists without migration history (e.g. from `EnsureCreated`), delete it before running migrations.

---

## Configuration

| Setting           | Location                         | Notes                                       |
| ----------------- | -------------------------------- | ------------------------------------------- |
| Connection string | `Program.cs` — hardcoded         | **Bug** — should be in `appsettings.json`   |
| Port              | `Properties/launchSettings.json` | `5265` (HTTP)                               |
| CORS policy       | `Program.cs`                     | `AllowAnyOrigin` — lock down for production |
| OpenAPI           | `Program.cs`                     | `app.MapOpenApi()` in Development only      |

---

## Security Notes

| Issue                            | Location                | Status                                      |
| -------------------------------- | ----------------------- | ------------------------------------------- |
| MD5 password hashing             | `AuthController.cs`     | **Bug** — must replace with BCrypt/PBKDF2   |
| Password hash returned to client | `AuthController.cs`     | **Bug** — `Ok(user)` leaks `PasswordHash`   |
| No JWT token on login            | `AuthController.cs`     | Returns raw user object instead of token    |
| No authentication middleware     | `Program.cs`            | Intentional stub — `[Authorize]` never used |
| Hardcoded connection string      | `Program.cs`            | **Bug** — move to appsettings               |
| Wide-open CORS                   | `Program.cs`            | `AllowAnyOrigin` — intentional for dev      |
| Stack trace in 500 response      | `EpisodesController.cs` | **Bug** — exposes internals to client       |

---

## Known Backend Bugs

> Full catalog: [`dotnet/BUGS.md`](../dotnet/BUGS.md)

### Critical

| Bug                         | Location                  | Issue                                                                                |
| --------------------------- | ------------------------- | ------------------------------------------------------------------------------------ |
| NullReferenceException      | `CharactersController.cs` | `FindAsync` result not null-checked before use — `return Ok(character.Name)` crashes |
| NullReferenceException      | `CharactersController.cs` | `Remove(character)` called with potentially null value                               |
| NullReferenceException      | `ShowsController.cs`      | Same pattern — `FindAsync` result not null-checked                                   |
| MD5 password hashing        | `AuthController.cs`       | Use BCrypt or PBKDF2 instead                                                         |
| Password hash in response   | `AuthController.cs`       | `Ok(user)` sends `PasswordHash` to client                                            |
| Hardcoded connection string | `Program.cs`              | Move to `appsettings.json`                                                           |
| Duplicate Jesse Pinkman     | `SeedData.cs`             | Character seeded twice with different Ids                                            |

### High Priority

| Bug                              | Location                                                      | Issue                                                                          |
| -------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `SaveChangesAsync` not awaited   | `CharactersController`, `ShowsController`                     | Fire-and-forget — changes may not persist                                      |
| N+1 / missing `.Include()`       | `ShowsController`, `QuotesController`                         | Navigation properties are always null                                          |
| Quote text truncated to 50 chars | `QuotesController.GetQuotes()`                                | `Substring(0, 50)` mutates data in response                                    |
| Wrong HTTP status on POST        | `CharactersController`, `ShowsController`, `QuotesController` | Returns `200 OK` instead of `201 Created`                                      |
| Missing DELETE endpoint          | `QuotesController`                                            | No way to delete quotes via API                                                |
| Inconsistent response envelope   | `EpisodesController`                                          | Returns `{ success, count, data }` — all other controllers return plain arrays |
| Stack trace exposed              | `EpisodesController`                                          | `ex.StackTrace` returned in 500 response                                       |
| `_context` not readonly          | `EpisodesController`                                          | Field should be `readonly`                                                     |
| Wide-open CORS                   | `Program.cs`                                                  | `AllowAnyOrigin` — lock down in production                                     |

---

## Related Docs

| Document                                                          | Purpose                                         |
| ----------------------------------------------------------------- | ----------------------------------------------- |
| [`dotnet/BUGS.md`](../dotnet/BUGS.md)                             | Full bug catalog with evidence and fix guidance |
| [`dotnet/SETUP.md`](../dotnet/SETUP.md)                           | Detailed setup instructions                     |
| [`fanhubdocs/frontend-architecture.md`](frontend-architecture.md) | Frontend implementation details                 |
