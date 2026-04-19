---
description: FanHub Blazor Server Frontend code and styling conventions for beautiful, well-formed components
applyTo: "dotnet/Frontend/**"
---

# FanHub Blazor Server Frontend Instructions

Guidelines for creating stunning, modern, and maintainable Blazor components in the FanHub frontend. Covers code patterns, styling conventions, layouts, colors, and best practices.

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

**✅ If form needs data, show loading state:**

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

### Dropdown vs. Input Fields

**✅ Always use dropdowns for related entities** (not numeric inputs):

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

When binding `int` to `<input type="number">`, the default value `0` displays and hides the placeholder.

**✅ Solution:** Use nullable `int?` instead:

```csharp
// ✅ Better — field stays empty until user types
private int? relatedEntityId;
<input type="number" @bind="relatedEntityId" placeholder="Enter ID" />
```

### Validation

- Check `HasValue` on nullable fields before submission
- Validate that required dropdowns have selected values (not `0`)
- Display validation errors in clear, user-friendly messages

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

- **Primary Green**: `#62d962` — Action buttons, accents, borders, focus states
- **Dark Background**: `#0a0a0a` — Page background, hero sections
- **Dark Gray**: `#1a1a1a` — Card backgrounds, darker accents
- **Light Gray**: `#f8f8f8` — Form sections, summary cards
- **Text Primary**: `#1a1a1a` — Dark backgrounds
- **Text Secondary**: `#666` or `#888` — Muted text
- **Text Light**: `#f0f0f0` or `#aaa` — On dark backgrounds

### Page Header Pattern

Every list page should have this header pattern:

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
.form-group {
  margin-bottom: 1.5rem;
}

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
  font-family: inherit;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

/* ✅ Green focus state — matches FanHub branding */
.form-control:focus {
  outline: none;
  border-color: #62d962;
  box-shadow: 0 0 0 3px rgba(98, 217, 98, 0.1);
}

textarea.form-control {
  resize: vertical;
  font-family: inherit;
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
  font-size: 0.95rem;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.1s;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Lift effect on hover */
.btn-submit:hover {
  background: #80e880;
  transform: translateY(-1px);
}

/* Secondary buttons */
.btn-secondary {
  background: transparent;
  color: #62d962;
  border: 2px solid #62d962;
}

.btn-secondary:hover {
  background: rgba(98, 217, 98, 0.1);
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
  border-top: 3px solid #62d962; /* ✅ Green accent */
  border-radius: 4px;
  padding: 1.5rem;
  transition:
    box-shadow 0.2s,
    transform 0.1s;
}

/* Lift and shadow on hover */
.entity-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
```

### Responsive Layout

```css
/* Two-column form + list on desktop, single column on mobile */
.entity-container {
  padding: 0 2rem 2rem;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

@@media (max-width: 900px) {
  .entity-container {
    grid-template-columns: 1fr;
  }
}
```

### Empty States & Loading

```razor
<!-- Empty state with emoji and clear messaging -->
@if (items == null || items.Count == 0)
{
    <p class="empty-state">No items yet. Be the first to add one!</p>
}

<!-- Loading state -->
@if (isLoading)
{
    <p class="loading">Loading items...</p>
}
```

```css
.empty-state {
  text-align: center;
  color: #999;
  padding: 3rem 2rem;
  font-size: 1.05rem;
}

.loading {
  text-align: center;
  color: #666;
  padding: 2rem;
}
```

### Error Messages

```css
.error-message {
  color: #d32f2f;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(211, 47, 47, 0.1);
  border-left: 4px solid #d32f2f;
  border-radius: 3px;
  font-size: 0.9rem;
}
```

---

## Razor-Specific Gotchas

### `@` Symbol Escaping in String Interpolation

The `@` symbol is special in Razor. String interpolation like `S@episode.SeasonId` conflicts with Razor syntax.

**✅ Double the `@` symbol:**

```razor
<!-- ✅ CORRECT — @@ escapes to single @ -->
<option value="@ep.Id">S@@ep.SeasonId E@@ep.EpisodeNumber: @ep.Title</option>

<!-- ❌ WRONG — conflicts with Razor syntax -->
<option value="@ep.Id">S@ep.SeasonId E@ep.EpisodeNumber: @ep.Title</option>

<!-- ✅ ALTERNATIVE — use helper method -->
<option value="@ep.Id">@FormatEpisode(ep)</option>

@code {
    private string FormatEpisode(Episode ep)
        => $"S{ep.SeasonId} E{ep.EpisodeNumber}: {ep.Title}";
}
```

### CSS `@media` in Scoped Styles

**✅ Escape with `@@media`:**

```css
@@media (max-width: 900px) {
  .container {
    grid-template-columns: 1fr;
  }
}
```

---

## Homepage Integration

### Summary Card

Display entity count on the homepage:

```razor
<div class="summary-stat">
    <span class="stat-number">@quotesCount</span>
    <span class="stat-label">Quotes</span>
</div>
```

Load count in `OnInitializedAsync()`:

```csharp
var quotes = await Http.GetFromJsonAsync<List<Quote>>("api/quotes");
quotesCount = quotes?.Count ?? 0;
```

### Nav Card

Add card linking to entity list page:

```razor
<a href="/quotes" class="nav-card">
    <div class="nav-card-icon">💬</div>
    <h2>Quotes</h2>
    <p>Iconic moments and memorable lines from Breaking Bad. Like and share your favorites.</p>
    <span class="nav-card-cta">View Quotes →</span>
</a>
```

```css
.nav-card {
  display: block;
  text-decoration: none;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-top: 3px solid #62d962;
  border-radius: 4px;
  padding: 2rem;
  transition:
    box-shadow 0.2s,
    transform 0.1s;
}

.nav-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  text-decoration: none;
}

.nav-card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.nav-card h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
}

.nav-card p {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

.nav-card-cta {
  font-weight: 700;
  color: #62d962;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

---

## Model Classes

Frontend models should **mirror backend models exactly** in structure and naming:

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

Before considering a component complete:

- [ ] Component compiles without errors or warnings
- [ ] All collections are null-checked before iteration
- [ ] Loading state displays while fetching data
- [ ] Empty state displays when no items exist
- [ ] Form has proper validation and error messages
- [ ] Related entities use dropdowns (not numeric inputs)
- [ ] All form inputs have focus states (green border + glow)
- [ ] Submit button has hover lift effect
- [ ] Cards display in responsive grid (stacks on mobile)
- [ ] Cards have hover lift and shadow effects
- [ ] Page header matches FanHub design (gradient + green border)
- [ ] All colors use FanHub palette (#62d962 green, dark backgrounds)
- [ ] No `@` symbol escaping issues (`@@` used where needed)
- [ ] Transitions are smooth (0.1–0.2s duration)
- [ ] Typography uses semantic hierarchy (h1, h2, p with proper sizes)
- [ ] Tested on mobile (responsive design works)
- [ ] No hardcoded URLs (use relative paths)
- [ ] Error handling in place (try-catch with user-friendly messages)

---
