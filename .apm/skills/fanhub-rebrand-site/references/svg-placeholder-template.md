# SVG Character Placeholder Template

> Used in `rebrand-site` Step 5 to generate character image placeholders.
> The dotnet `CharacterCard` component already falls back to initials — these SVGs
> match that aesthetic so the placeholder looks intentional, not broken.

---

## Single Character SVG

Replace `{INITIAL}` with the character's first initial, `{NAME}` with their full name,
and the `{COLOR_*}` tokens with the hex values from `references/design-tokens.md` (Phase 0).

Save as `dotnet/Frontend/wwwroot/images/characters/{kebab-case-name}.jpg`
(keep `.jpg` extension — the `CharacterImages` dictionary uses `.jpg` keys).

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
  <!-- Background using --color-surface from design tokens -->
  <rect width="400" height="500" fill="{COLOR_SURFACE}"/>

  <!-- Top accent line using --color-accent -->
  <rect width="400" height="4" fill="{COLOR_ACCENT}"/>

  <!-- Large initial using --color-accent -->
  <text
    x="200" y="280"
    font-family="Georgia, serif"
    font-size="160"
    font-weight="700"
    fill="{COLOR_ACCENT}"
    opacity="0.85"
    text-anchor="middle"
    dominant-baseline="middle"
  >{INITIAL}</text>

  <!-- Character name using --color-text-muted -->
  <text
    x="200" y="450"
    font-family="Georgia, serif"
    font-size="18"
    fill="{COLOR_TEXT_MUTED}"
    text-anchor="middle"
    letter-spacing="3"
  >{NAME}</text>
</svg>
```

---

## Bulk Generation Script (PowerShell)

Generate all placeholders at once. Build the character list from the universe file's Characters sections.
The `CharacterImages` dictionary in `SeedData.cs` defines the exact filename keys — match them here.

```powershell
# run from repo root
$outputDir = "dotnet/Frontend/wwwroot/images/characters"
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

# Build this hashtable from the universe file's character list.
# Key = kebab-case name matching SeedData.cs CharacterImages dictionary.
# Value = first initial (use character's first name initial).
$characters = @{
    # Example entries — replace with actual characters from the universe file:
    # "character-name" = @{ Initial = "X"; Name = "CHARACTER NAME" }
}

$svgBase = @'
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
  <rect width="400" height="500" fill="{COLOR_SURFACE}"/>
  <rect width="400" height="4" fill="{COLOR_ACCENT}"/>
  <text x="200" y="280" font-family="Georgia, serif" font-size="160" font-weight="700"
        fill="{COLOR_ACCENT}" opacity="0.85" text-anchor="middle" dominant-baseline="middle">INITIAL</text>
  <text x="200" y="450" font-family="Georgia, serif" font-size="18"
        fill="{COLOR_TEXT_MUTED}" text-anchor="middle" letter-spacing="3">NAME</text>
</svg>
'@

foreach ($key in $characters.Keys) {
    $char = $characters[$key]
    $svg = $svgBase -replace 'INITIAL', $char.Initial `
                    -replace 'NAME', $char.Name
    $outPath = "$outputDir/$key.jpg"
    $svg | Set-Content $outPath -Encoding UTF8
    Write-Host "Created: $outPath"
}

Write-Host "Done. $($characters.Count) placeholders created."
```

> Replace `{COLOR_SURFACE}`, `{COLOR_ACCENT}`, `{COLOR_TEXT_MUTED}` with the hex values
> from `references/design-tokens.md` after completing Phase 0 research.

---

## Naming Convention

Character image filenames must match the keys in `SeedData.cs`'s `CharacterImages` dictionary:

```csharp
var CharacterImages = new Dictionary<string, string>
{
    { "Tommy Shelby",       "/images/characters/tommy-shelby.jpg" },
    { "Arthur Shelby Jr.",  "/images/characters/arthur-shelby.jpg" },
    // ... etc.
};
```

**Rule**: `kebab-case(character name without suffixes like Jr./Sr.) + .jpg`
