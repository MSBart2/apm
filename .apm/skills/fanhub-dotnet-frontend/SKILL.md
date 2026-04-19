---
name: dotnet-frontend
description: >
  FanHub Blazor Server frontend conventions, patterns, and styling. Use when writing
  or fixing Razor components in dotnet/Frontend/ — data loading, null safety, form
  design, dropdowns, FanHub brand colors, CSS patterns, or Razor gotchas.
---

# FanHub Blazor Server Frontend

Guidelines for modern, maintainable Blazor components with consistent FanHub styling.

---

## Code Quality & Architecture

### Component Structure

- Always use `@rendermode InteractiveServer` for pages requiring interactivity
- Place model classes in `dotnet/Frontend/Models/` (mirror backend models exactly)
- Use `@page "/route"` directive at top of Razor files
- Import models: `@using Frontend.Models`
- Inject HttpClient: `@inject HttpClient Http`

### Async & Data Loading

```csharp
// ✅ Load data in parallel for better performance
protected override async Task OnInitializedAsync()
{
    isLoading = true;
    try
    {
        var task1 = Http.GetFromJsonAsync<List<Quote>>("api/quotes");
        var task2 = Http.GetFromJsonAsync<List<Character>>("api/characters");
        var task3 = Http.GetFromJsonAsync<List<Episode>>("api/episodes");

        await Task.WhenAll(task1, task2, task3);

        quotes = await task1;
        characters = await task2;
        episodes = await task3;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error: {ex.Message}");
    }
    finally
    {
        isLoading = false;
    }
}
```

### Null Safety & Server-Side Rendering (SSR)

**Critical:** Blazor InteractiveServer renders on the server BEFORE `OnInitializedAsync()` completes. Collections are `null` during initial render.

**✅ Always null-check collections before iterating:**

```razor
@if (characters != null)
{
    @foreach (var character in characters)
    {
        <option value="@character.Id">@character.Name</option>
    }
}
```

**✅ Show loading state while data loads:**

```razor
@if (isLoading)
{
    <p class="loading">Loading form data...</p>
}
else
{
    <form @onsubmit="HandleSubmit">
        <!-- form content -->
    </form>
}
```

### API Response Handling

Some endpoints return wrapped responses: `{ success: bool, count: int, data: T[] }` (e.g., Episodes).

**✅ Create a DTO for wrapped responses:**

```csharp
private class ApiResponse<T>
{
    public bool Success { get; set; }
    public int Count { get; set; }
    public List<T> Data { get; set; }
}

// In OnInitializedAsync:
var response = await Http.GetFromJsonAsync<ApiResponse<Episode>>("api/episodes");
episodes = response?.Data;
```

### Error Handling

- Wrap async operations in try-catch
- Never throw exceptions to the UI — catch and display user-friendly messages
- Log to console for debugging: `Console.WriteLine($"Error: {ex.Message}")`
- Show error messages in `@if (!string.IsNullOrEmpty(errorMessage))` blocks

---

## Form Design & User Experience

### Dropdowns for Related Entities

**✅ Always use dropdowns for FK fields** (never `<input type="number">`):

```razor
<!-- ✅ GOOD — user-friendly, prevents invalid foreign keys -->
<select @bind="newQuote.CharacterId">
    <option value="0">Select a character...</option>
    @if (characters != null)
    {
        @foreach (var character in characters)
        {
            <option value="@character.Id">@character.Name</option>
        }
    }
</select>

<!-- ❌ AVOID — forces users to guess numeric IDs -->
<input type="number" @bind="newQuote.CharacterId" placeholder="Character ID" />
```

### Numeric Input Gotcha

When binding `int` to `<input type="number">`, the default value `0` hides the placeholder.

**✅ Use nullable `int?` instead:**

```csharp
private int? relatedEntityId;
<input type="number" @bind="relatedEntityId" placeholder="Enter ID" />
```

### Validation

```csharp
private async Task HandleSubmit()
{
    errorMessage = null;

    if (newQuote.CharacterId == 0 || newQuote.EpisodeId == 0 ||
        string.IsNullOrWhiteSpace(newQuote.QuoteText))
    {
        errorMessage = "Please fill in all fields";
        return;
    }
    // Proceed with submission
}
```

---

## Styling & Colors

### FanHub Brand Colors

| Token | Value | Use |
|-------|-------|-----|
| Primary Green | `#62d962` | Buttons, accents, borders, focus states |
| Dark Background | `#0a0a0a` | Page background, hero sections |
| Dark Gray | `#1a1a1a` | Card backgrounds |
| Light Gray | `#f8f8f8` | Form sections, summary cards |
| Text Muted | `#666` / `#888` | Secondary text |
| Text On Dark | `#f0f0f0` / `#aaa` | Text on dark backgrounds |

### Page Header Pattern

```razor
<div class="page-header">
    <div class="page-header-label">FanHub</div>
    <h1>Entity Name</h1>
    <p class="page-subtitle">Brief description of the page content</p>
</div>

<style>
    .page-header {
        background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
        color: white;
        padding: 3rem 2rem 2.5rem;
        margin: -2rem -2rem 2rem;
        border-bottom: 3px solid #62d962;
    }

    .page-header-label {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: #62d962;
        font-weight: 700;
        margin-bottom: 0.5rem;
    }

    .page-header h1 {
        font-size: clamp(2rem, 5vw, 3rem);
        font-weight: 900;
        margin: 0;
        color: #ffffff;
    }

    .page-subtitle {
        color: #aaa;
        font-size: 1.05rem;
        margin: 0.5rem 0 0;
    }
</style>
```

### Form Styling

```css
.form-group { margin-bottom: 1.5rem; }

.form-group label {
    display: block;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
}

.form-control {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 3px;
    font-size: 0.95rem;
    transition: border-color 0.2s, box-shadow 0.2s;
}

/* ✅ Green focus state — matches FanHub branding */
.form-control:focus {
    outline: none;
    border-color: #62d962;
    box-shadow: 0 0 0 3px rgba(98, 217, 98, 0.1);
}
```

### Button Styling

```css
.btn-submit {
    width: 100%;
    padding: 0.85rem;
    background: #62d962;
    color: #0a0a0a;
    border: none;
    border-radius: 3px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.btn-submit:hover {
    background: #80e880;
    transform: translateY(-1px);  /* Lift effect */
}

.btn-secondary {
    background: transparent;
    color: #62d962;
    border: 2px solid #62d962;
}
```

### Card Grid Layout

```css
.entity-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.entity-card {
    background: white;
    border: 1px solid #e0e0e0;
    border-top: 3px solid #62d962;  /* ✅ Green accent */
    border-radius: 4px;
    padding: 1.5rem;
    transition: box-shadow 0.2s, transform 0.1s;
}

.entity-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}
```

### Responsive Layout

```css
.entity-container {
    padding: 0 2rem 2rem;
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
}

@@media (max-width: 900px) {
    .entity-container { grid-template-columns: 1fr; }
}
```

### Empty States & Loading

```razor
@if (items == null || items.Count == 0)
{
    <p class="empty-state">No items yet. Be the first to add one!</p>
}

@if (isLoading)
{
    <p class="loading">Loading items...</p>
}
```

```css
.empty-state { text-align: center; color: #999; padding: 3rem 2rem; }
.loading { text-align: center; color: #666; padding: 2rem; }
.error-message {
    color: #d32f2f;
    padding: 0.75rem;
    background: rgba(211, 47, 47, 0.1);
    border-left: 4px solid #d32f2f;
    border-radius: 3px;
}
```

---

## Razor-Specific Gotchas

### `@` Symbol Escaping in String Interpolation

The `@` symbol is special in Razor — use `@@` to escape it:

```razor
<!-- ✅ CORRECT -->
<option value="@ep.Id">S@@ep.SeasonId E@@ep.EpisodeNumber: @ep.Title</option>

<!-- ✅ ALTERNATIVE — use a helper method -->
<option value="@ep.Id">@FormatEpisode(ep)</option>

@code {
    private string FormatEpisode(Episode ep)
        => $"S{ep.SeasonId} E{ep.EpisodeNumber}: {ep.Title}";
}
```

### CSS `@media` in Scoped Styles

```css
/* ✅ Escape with @@ */
@@media (max-width: 900px) {
    .container { grid-template-columns: 1fr; }
}
```

---

## Homepage Integration

### Summary Card

```razor
<div class="summary-stat">
    <span class="stat-number">@quotesCount</span>
    <span class="stat-label">Quotes</span>
</div>
```

```csharp
var quotes = await Http.GetFromJsonAsync<List<Quote>>("api/quotes");
quotesCount = quotes?.Count ?? 0;
```

### Nav Card

```razor
<a href="/quotes" class="nav-card">
    <div class="nav-card-icon">💬</div>
    <h2>Quotes</h2>
    <p>Iconic moments and memorable lines from Breaking Bad.</p>
    <span class="nav-card-cta">View Quotes →</span>
</a>
```

---

## Model Classes

Frontend models mirror backend models exactly:

```csharp
namespace Frontend.Models;

public class Quote
{
    public int Id { get; set; }
    public int ShowId { get; set; }
    public int CharacterId { get; set; }
    public int EpisodeId { get; set; }
    public string QuoteText { get; set; } = "";
    public bool IsFamous { get; set; }
    public int Likes { get; set; }
}
```

**Never** add navigation properties, computed properties, or decorators to frontend models.

---

## Component Checklist

- [ ] All collections null-checked before iteration
- [ ] Loading state displays while fetching data
- [ ] Empty state displays when no items exist
- [ ] Related entities use dropdowns (not numeric inputs)
- [ ] All form inputs have green focus states
- [ ] Submit button has hover lift effect
- [ ] Cards display in responsive grid
- [ ] Page header matches FanHub design (gradient + green border)
- [ ] `@@` used for `@` escaping in Razor where needed
- [ ] Error handling in place with user-friendly messages
