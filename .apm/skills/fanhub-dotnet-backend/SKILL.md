---
name: dotnet-backend
description: >
  FanHub ASP.NET Core backend conventions, patterns, and best practices. Use when
  writing or fixing C# code in dotnet/Backend/ — controllers, models, DbContext,
  EF Core queries, seeding, HTTP status codes, CORS, or unit tests.
---

# FanHub ASP.NET Core Backend

Guidelines for high-quality, maintainable C# code in the FanHub backend API.

---

## Architecture & Code Quality

### Controller Pattern (No Repository Layer)

FanHub uses direct `FanHubContext` injection in controllers — no repository layer or service classes.

**✅ Inject DbContext directly:**

```csharp
[ApiController]
[Route("api/[controller]")]
public class QuotesController : ControllerBase
{
    private readonly FanHubContext _context;

    public QuotesController(FanHubContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetQuotes()
    {
        var quotes = await _context.Quotes.ToListAsync();
        return Ok(quotes);
    }
}
```

**Route Convention:** `[Route("api/[controller]")]` maps to `/api/{ControllerName}` (pluralized, lowercase).
- `QuotesController` → `/api/quotes`
- `CharactersController` → `/api/characters`
- `EpisodesController` → `/api/episodes`

### Model Design

```csharp
namespace Backend.Models;

public class Quote
{
    public int Id { get; set; }
    public int ShowId { get; set; }
    public int CharacterId { get; set; }
    public int EpisodeId { get; set; }
    public string QuoteText { get; set; }  // Non-nullable strings
    public bool IsFamous { get; set; }
    public int Likes { get; set; }
}
```

**Conventions:**
- Primary key: `int Id`
- Foreign keys: `int ShowId`, `int CharacterId`, etc.
- All string properties non-nullable (no `?`) unless truly optional
- **No navigation properties** — keep models simple (see EF Core section)

### Async/Await Patterns

Always use async when accessing the database:

```csharp
// ✅ CORRECT — Async with await
[HttpGet]
public async Task<IActionResult> GetQuotes()
{
    var quotes = await _context.Quotes.ToListAsync();
    return Ok(quotes);
}

[HttpPost]
public async Task<IActionResult> CreateQuote([FromBody] Quote item)
{
    _context.Quotes.Add(item);
    await _context.SaveChangesAsync();
    return Ok(item);
}

// ❌ AVOID — Synchronous database calls (blocks thread pool)
public IActionResult GetQuotes()
{
    var quotes = _context.Quotes.ToList();  // Blocks
    return Ok(quotes);
}
```

### Error Handling & Validation

```csharp
[HttpPost]
public async Task<IActionResult> CreateQuote([FromBody] Quote item)
{
    if (item == null || string.IsNullOrWhiteSpace(item.QuoteText))
        return BadRequest("Quote text is required");

    if (item.CharacterId <= 0 || item.EpisodeId <= 0)
        return BadRequest("Character and Episode must be specified");

    try
    {
        _context.Quotes.Add(item);
        await _context.SaveChangesAsync();
        return Ok(item);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error creating quote: {ex.Message}");
        return StatusCode(500, "An error occurred while creating the quote");
    }
}
```

---

## Database Seeding — Critical Gotcha

### The Problem: New Seed Data Doesn't Appear

When you add new records to `SeedData.cs`, they may not show up in the API until you delete `fanhub.db`.

**Why:** The backend uses `EnsureCreated()` instead of migrations. The seeding check `if (context.Shows.Any())` returns `true` if the database exists, so new seed data is never inserted.

### The Solution: Always Delete the Database After Schema Changes

```powershell
# From dotnet/ directory:
# 1. Stop the backend (Ctrl+C in the terminal)

# 2. Delete the database
Remove-Item fanhub.db -Force

# 3. Restart
.\start.ps1
```

**Why you must stop the backend first:** SQLite locks the database file while the backend is running.

### Proper Seeding Pattern

```csharp
public static void Initialize(FanHubContext context)
{
    context.Database.EnsureCreated();

    if (context.Shows.Any()) return;  // Already seeded

    // Seed in dependency order: Shows → Characters → Episodes → Quotes
    var shows = new[] { new Show { Id = 1, Title = "Breaking Bad", ... } };
    context.Shows.AddRange(shows);
    context.SaveChanges();

    var characters = new[] { new Character { ShowId = 1, Name = "Walter White", ... } };
    context.Characters.AddRange(characters);
    context.SaveChanges();

    // Quotes reference CharacterId and EpisodeId — seed those first
    var quotes = new[]
    {
        new Quote
        {
            ShowId = 1,
            CharacterId = 1,  // Must exist in Characters
            EpisodeId = 1,    // Must exist in Episodes
            QuoteText = "I am not in danger, Skyler. I am the danger!",
            IsFamous = true,
            Likes = 0
        },
    };
    context.Quotes.AddRange(quotes);
    context.SaveChanges();
}
```

**Key points:**
- Seed in dependency order (Shows → Characters → Episodes → Quotes)
- All entities use `ShowId = 1` (Breaking Bad)
- Call `SaveChanges()` after each logical group
- Content must match canonical Breaking Bad lore

---

## Entity Framework Core Conventions

### DbContext Setup

```csharp
namespace Backend.Data;

public class FanHubContext : DbContext
{
    public FanHubContext(DbContextOptions<FanHubContext> options) : base(options) { }

    public DbSet<Show> Shows { get; set; }
    public DbSet<Character> Characters { get; set; }
    public DbSet<Episode> Episodes { get; set; }
    public DbSet<Quote> Quotes { get; set; }
}
```

**Don't add:** navigation properties, shadow properties, computed properties, or validation attributes.

### Relationships & Foreign Keys

```csharp
// ✅ CORRECT — Foreign key only, no navigation properties
public class Quote
{
    public int Id { get; set; }
    public int ShowId { get; set; }
    public int CharacterId { get; set; }
    public int EpisodeId { get; set; }
    public string QuoteText { get; set; }
}
```

**Why no nav props:** They cause lazy-loading issues and complicate JSON serialization.

### Querying Best Practices

```csharp
// ✅ Filter at the database level
var quotes = await _context.Quotes
    .Where(q => q.ShowId == 1)
    .OrderByDescending(q => q.Likes)
    .Take(10)
    .ToListAsync();

// ✅ Single record by PK
var quote = await _context.Quotes.FindAsync(id);

// ❌ AVOID — Loads everything then filters in memory
var allQuotes = await _context.Quotes.ToListAsync();
```

---

## HTTP Controller Design

### GET Endpoints

```csharp
// GET /api/quotes — List all
[HttpGet]
public async Task<IActionResult> GetQuotes()
{
    var quotes = await _context.Quotes.ToListAsync();
    return Ok(quotes);
}

// GET /api/quotes/{id} — Single by ID
[HttpGet("{id}")]
public async Task<IActionResult> GetQuote(int id)
{
    var quote = await _context.Quotes.FindAsync(id);
    if (quote == null) return NotFound();
    return Ok(quote);
}
```

### POST Endpoints

```csharp
// POST /api/quotes — Create new
[HttpPost]
public async Task<IActionResult> CreateQuote([FromBody] Quote item)
{
    if (item == null) return BadRequest("Quote is required");

    _context.Quotes.Add(item);
    await _context.SaveChangesAsync();
    return Ok(item);  // Return created entity with new ID
}
```

### Status Codes

| Code | Use |
|------|-----|
| 200 OK | Successful GET/POST returning data |
| 204 No Content | Successful DELETE or PUT with no body |
| 400 Bad Request | Validation error or invalid input |
| 404 Not Found | Resource doesn't exist |
| 500 Internal Server Error | Unhandled server error |

### CORS & Security

**Current state:** CORS is wide open (allows all origins — intentional for the workshop).

```csharp
// ❌ CURRENT — Insecure for production
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

// ✅ BETTER for production — Restrict to known origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder => builder.WithOrigins("http://localhost:3000", "https://yourdomain.com")
                         .AllowAnyMethod().AllowAnyHeader());
});
```

---

## Testing Best Practices

### Unit Test Structure

```csharp
public class QuoteRepositoryTests
{
    private FanHubContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<FanHubContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new FanHubContext(options);
    }

    [Fact]
    public async Task CreateQuote_WithValidData_ReturnsQuote()
    {
        var context = CreateContext();
        var quote = new Quote { ShowId = 1, CharacterId = 1, EpisodeId = 1,
                                QuoteText = "Test quote", IsFamous = false, Likes = 0 };

        context.Quotes.Add(quote);
        await context.SaveChangesAsync();

        var result = await context.Quotes.FindAsync(quote.Id);
        Assert.NotNull(result);
        Assert.Equal("Test quote", result.QuoteText);
    }
}
```
