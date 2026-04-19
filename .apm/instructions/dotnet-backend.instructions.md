---
description: FanHub ASP.NET Core backend best practices for high-quality, testable, maintainable, and elegant C# code
applyTo: "dotnet/Backend/**"
---

# FanHub ASP.NET Core Backend Instructions

Guidelines for creating high-quality, testable, and maintainable C# code in the FanHub backend API. Covers architecture patterns, database seeding, EF Core conventions, controller design, and best practices.

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

Backend models define the database schema. Keep them clean and consistent:

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
- No computed properties or decorators in the model
- **No navigation properties** — keep models simple (see Seeding section for why)

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
    // Validate input
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
        // Log the exception (implement logging in production)
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

**When you modify SeedData.cs or the model schema:**

1. **Stop the backend** — Press `Ctrl+C` in the terminal
2. **Delete `fanhub.db`** — It will be recreated on next startup
3. **Restart the backend** — `.\start.ps1`

```powershell
# From dotnet/ directory:
# 1. Stop the backend (Ctrl+C in the terminal)

# 2. Delete the database
Remove-Item fanhub.db -Force

# 3. Restart
.\start.ps1
```

**Why you must stop the backend first:** SQLite locks the database file while the backend is running. You cannot delete a locked file.

### Proper Seeding Pattern

In `dotnet/Backend/Data/SeedData.cs`:

```csharp
public static void Initialize(FanHubContext context)
{
    // Ensure database exists (creates schema if missing)
    context.Database.EnsureCreated();

    // Early return if already seeded
    if (context.Shows.Any())
    {
        // Optional: backfill or update existing data
        // Example: Update character images for missing URLs
        return;
    }

    // Seed Shows
    var shows = new[]
    {
        new Show
        {
            Id = 1,
            Title = "Breaking Bad",
            Description = "...",
            // ... properties
        }
    };
    context.Shows.AddRange(shows);
    context.SaveChanges();

    // Seed Characters (ShowId = 1)
    var characters = new[]
    {
        new Character
        {
            ShowId = 1,
            Name = "Walter White",
            // ... properties
        },
        // ... more characters
    };
    context.Characters.AddRange(characters);
    context.SaveChanges();

    // Seed Episodes (ShowId = 1)
    var episodes = new[]
    {
        new Episode
        {
            ShowId = 1,
            SeasonId = 1,
            EpisodeNumber = 1,
            Title = "Pilot",
            // ... properties
        },
        // ... more episodes
    };
    context.Episodes.AddRange(episodes);
    context.SaveChanges();

    // Seed Quotes (ShowId = 1, reference Character and Episode IDs)
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
        // ... more quotes
    };
    context.Quotes.AddRange(quotes);
    context.SaveChanges();
}
```

**Key points:**
- Seed in dependency order (Shows → Characters → Episodes → Quotes)
- All entities use `ShowId = 1` (Breaking Bad)
- Foreign key IDs must reference existing seed data
- Call `SaveChanges()` after each logical group
- Content must match canonical Breaking Bad lore

### Testing Seed Data

After restarting the backend with new seed data:

```bash
# Test in PowerShell
curl http://localhost:5265/api/quotes
curl http://localhost:5265/api/characters
curl http://localhost:5265/api/episodes
```

Verify the count matches your seed expectations.

---

## Entity Framework Core Conventions

### DbContext Setup

Keep `FanHubContext` lean:

```csharp
namespace Backend.Data;

public class FanHubContext : DbContext
{
    public FanHubContext(DbContextOptions<FanHubContext> options) : base(options) { }

    public DbSet<Show> Shows { get; set; }
    public DbSet<Character> Characters { get; set; }
    public DbSet<Episode> Episodes { get; set; }
    public DbSet<Quote> Quotes { get; set; }
    
    // Only override OnModelCreating if you need custom configurations
    // For basic setups, EF Core conventions handle it
}
```

**Don't add:**
- Navigation properties to models
- Complex shadow properties
- Computed properties
- Validation attributes

### Relationships & Foreign Keys

FanHub models use foreign key properties only (no navigation properties):

```csharp
// ✅ CORRECT — Foreign key only
public class Quote
{
    public int Id { get; set; }
    public int ShowId { get; set; }
    public int CharacterId { get; set; }  // FK to Character
    public int EpisodeId { get; set; }    // FK to Episode
    public string QuoteText { get; set; }
}

// ❌ AVOID — Navigation properties
public class Quote
{
    public int Id { get; set; }
    public int ShowId { get; set; }
    public int CharacterId { get; set; }
    public int EpisodeId { get; set; }
    public string QuoteText { get; set; }
    
    public Character Character { get; set; }  // ❌ No nav props
    public Episode Episode { get; set; }      // ❌ No nav props
}
```

**Why:** Navigation properties cause lazy-loading issues and complicate serialization to JSON. Keep the domain model simple.

### Querying Best Practices

```csharp
// ✅ GOOD — Explicit what data you need
var quotes = await _context.Quotes
    .Where(q => q.ShowId == 1)
    .OrderByDescending(q => q.Likes)
    .Take(10)
    .ToListAsync();

// ✅ GOOD — Use .Find() for single record by PK
var quote = await _context.Quotes.FindAsync(id);

// ❌ AVOID — N+1 queries (lazy loading)
var quotes = _context.Quotes.ToList();
foreach (var q in quotes)
{
    var character = _context.Characters.Find(q.CharacterId);  // Extra query per item!
}

// ❌ AVOID — No data filtering (loads everything)
var allQuotes = await _context.Quotes.ToListAsync();
```

---

## HTTP Controller Design

### GET Endpoints

```csharp
// GET /api/quotes - List all
[HttpGet]
public async Task<IActionResult> GetQuotes()
{
    var quotes = await _context.Quotes.ToListAsync();
    return Ok(quotes);
}

// GET /api/quotes/{id} - Single by ID
[HttpGet("{id}")]
public async Task<IActionResult> GetQuote(int id)
{
    var quote = await _context.Quotes.FindAsync(id);
    if (quote == null)
        return NotFound();
    return Ok(quote);
}
```

### POST Endpoints

```csharp
// POST /api/quotes - Create new
[HttpPost]
public async Task<IActionResult> CreateQuote([FromBody] Quote item)
{
    if (item == null)
        return BadRequest("Quote is required");

    _context.Quotes.Add(item);
    await _context.SaveChangesAsync();
    return Ok(item);  // Return created entity with new ID
}
```

### Status Codes

Use correct HTTP status codes:

- **200 OK** — Successful GET/POST that returns data
- **201 Created** — POST that creates a resource (optional, 200 is also fine)
- **204 No Content** — Successful DELETE or PUT with no response body
- **400 Bad Request** — Validation error or invalid input
- **401 Unauthorized** — Authentication required
- **403 Forbidden** — Authenticated but not authorized
- **404 Not Found** — Resource doesn't exist
- **500 Internal Server Error** — Unhandled server error

### CORS & Security

**Current state:** CORS is wide open (allows all origins). For production:

```csharp
// ❌ CURRENT — Insecure for production
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin()
                         .AllowAnyMethod()
                         .AllowAnyHeader());
});

// ✅ BETTER — Restrict to known origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder => builder.WithOrigins("http://localhost:3000", "https://yourdomain.com")
                         .AllowAnyMethod()
                         .AllowAnyHeader());
});
```

---

## Testing Best Practices

### Unit Test Structure

```csharp
using Xunit;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

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
        // Arrange
        var context = CreateContext();
        var quote = new Quote
        {
            ShowId = 1,
            CharacterId = 1,
            EpisodeId = 1,
            QuoteText = "Test quote",
            IsFamous = false,
            Likes = 0
        };

        // Act
        context.Quotes.Add(quote);
        await context.SaveChangesAsync();

        // Assert
        var result = await context.Quotes.FindAsync(quote.Id);
        Assert.NotNull(result);
        Assert.Equal("Test quote", result.QuoteText);
    }
}
```

### Testing Controllers

```csharp
[Theory]
[InlineData(1)]
[InlineData(100)]
public async Task GetQuote_WithValidId_ReturnsOk(int id)
{
    // Arrange
    var mockContext = new Mock<FanHubContext>();
    var controller = new QuotesController(mockContext.Object);
    var quote = new Quote { Id = id, QuoteText = "Test", ShowId = 1 };

    mockContext.Setup(c => c.Quotes.FindAsync(id))
        .ReturnsAsync(quote);

    // Act
    var result = await controller.GetQuote(id);

    // Assert
    var okResult = Assert.IsType<OkObjectResult>(result);
    Assert.Equal(quote, okResult.Value);
}
```

---

## Common Pitfalls

### ❌ Pitfall 1: Forgetting to Call `SaveChangesAsync()`

```csharp
// ❌ WRONG — Changes not persisted
_context.Quotes.Add(newQuote);
// Missing: await _context.SaveChangesAsync();
return Ok(newQuote);

// ✅ CORRECT
_context.Quotes.Add(newQuote);
await _context.SaveChangesAsync();
return Ok(newQuote);
```

### ❌ Pitfall 2: Navigation Properties Causing Serialization Loops

```csharp
// ❌ WRONG — Circular reference when serialized to JSON
public class Quote
{
    public int Id { get; set; }
    public int CharacterId { get; set; }
    public Character Character { get; set; }  // Causes loop!
}

// ✅ CORRECT — Foreign key only
public class Quote
{
    public int Id { get; set; }
    public int CharacterId { get; set; }
}
```

### ❌ Pitfall 3: Mixing Sync and Async

```csharp
// ❌ WRONG — .Result blocks the thread pool
var quotes = _context.Quotes.ToListAsync().Result;

// ✅ CORRECT
var quotes = await _context.Quotes.ToListAsync();
```

### ❌ Pitfall 4: New Seed Data Not Appearing

See **Database Seeding — Critical Gotcha** section above. **TL;DR:** Delete `fanhub.db` after modifying `SeedData.cs`.

### ❌ Pitfall 5: Hardcoded Connection Strings

```csharp
// ❌ WRONG — Hardcoded, breaks with different environments
builder.Services.AddDbContext<FanHubContext>(options =>
    options.UseSqlite("Data Source=fanhub.db"));

// ✅ BETTER — Use configuration
builder.Services.AddDbContext<FanHubContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
```

---

## Debugging Tips

### Enable SQL Query Logging

```csharp
builder.Services.AddDbContext<FanHubContext>(options =>
    options.UseSqlite("Data Source=fanhub.db")
           .LogTo(Console.WriteLine));  // Logs all SQL queries
```

### Check Database State

```bash
# From dotnet/Backend/ directory:
# Use sqlite3 command line (if installed)
sqlite3 fanhub.db
> SELECT COUNT(*) FROM Quotes;
> SELECT * FROM Quotes LIMIT 5;
```

### Backend Health Check

```bash
# Test API is running
curl http://localhost:5265/api/quotes

# Check status code
curl -i http://localhost:5265/api/quotes

# Pretty-print JSON (if jq installed)
curl http://localhost:5265/api/quotes | jq .
```

---

## Code Organization

### File Structure

```
dotnet/Backend/
├── Controllers/
│   ├── QuotesController.cs
│   ├── CharactersController.cs
│   ├── EpisodesController.cs
│   └── ShowsController.cs
├── Data/
│   ├── FanHubContext.cs
│   └── SeedData.cs
├── Models/
│   ├── Quote.cs
│   ├── Character.cs
│   ├── Episode.cs
│   ├── Show.cs
│   └── [other models]
├── Properties/
│   └── launchSettings.json
├── Backend.csproj
├── Program.cs
├── appsettings.json
└── appsettings.Development.json
```

### Naming Conventions

- **Controllers:** `{EntityName}Controller` (e.g., `QuotesController`)
- **Models:** `{EntityName}` (e.g., `Quote`, `Character`)
- **DbContext methods:** `Get{EntityName}`, `Create{EntityName}`
- **Database columns:** PascalCase (EF Core auto-converts to database convention)
- **Private fields:** `_camelCase` (e.g., `_context`)

---

## Code Review Checklist

Before submitting or finalizing backend code:

- [ ] Compiles without errors or warnings
- [ ] All async methods use `await`
- [ ] All database access is async (`ToListAsync()`, `FindAsync()`, `SaveChangesAsync()`)
- [ ] Foreign key IDs reference existing seed data
- [ ] Controllers inject `FanHubContext` only
- [ ] No navigation properties in models
- [ ] String properties are non-nullable (no `?`)
- [ ] HTTP status codes are correct (200, 201, 400, 404, 500)
- [ ] Error handling in place (try-catch or validation)
- [ ] GET endpoints return data
- [ ] POST endpoints create and return new entity
- [ ] Seed data is in logical dependency order
- [ ] All foreign keys (`ShowId`, `CharacterId`, etc.) use `int` (not nullable)
- [ ] No hardcoded connection strings or secrets
- [ ] Tests exist and pass
- [ ] New seed data tested (after deleting `fanhub.db`)

---

## Example: Production-Ready Controller

See [`dotnet/Backend/Controllers/QuotesController.cs`](../../dotnet/Backend/Controllers/QuotesController.cs) as reference, noting the bugs commented as learning examples. A corrected version would:

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

    [HttpGet("{id}")]
    public async Task<IActionResult> GetQuote(int id)
    {
        var quote = await _context.Quotes.FindAsync(id);
        if (quote == null)
            return NotFound();
        return Ok(quote);
    }

    [HttpPost]
    public async Task<IActionResult> CreateQuote([FromBody] Quote item)
    {
        if (item == null || string.IsNullOrWhiteSpace(item.QuoteText))
            return BadRequest("Quote text is required");

        _context.Quotes.Add(item);
        await _context.SaveChangesAsync();
        return Ok(item);
    }

    [HttpPost("{id}/like")]
    public async Task<IActionResult> LikeQuote(int id)
    {
        var quote = await _context.Quotes.FindAsync(id);
        if (quote == null)
            return NotFound();

        quote.Likes++;
        await _context.SaveChangesAsync();
        return Ok(quote);
    }
}
```
