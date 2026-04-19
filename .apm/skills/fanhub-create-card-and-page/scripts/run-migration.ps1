<#
.SYNOPSIS
    Stops the running FanHub backend, wipes fanhub.db, then adds the EF Core migration.
    On next startup the app calls context.Database.Migrate() then seeds fresh data.

.PARAMETER EntityName
    Singular PascalCase entity name (e.g. "Location", "Faction").

.EXAMPLE
    .\run-migration.ps1 -EntityName Location
#>
param(
    [Parameter(Mandatory)]
    [string]$EntityName
)

$BackendPath = Join-Path $PSScriptRoot "..\..\..\..\dotnet\Backend"
$DbPath = Join-Path $BackendPath "fanhub.db"

if (-not (Test-Path $BackendPath)) {
    Write-Error "Backend project not found at: $BackendPath"
    exit 1
}

# ── Step 1: Stop running FanHub backend processes ─────────────────────────────
Write-Host ""
Write-Host "Step 1/3  Stopping running FanHub backend processes..." -ForegroundColor Cyan

$stopped = $false
try {
    $processes = Get-Process -Name "dotnet" -ErrorAction SilentlyContinue
    foreach ($proc in $processes) {
        try {
            $cmdLine = (Get-CimInstance Win32_Process -Filter "ProcessId=$($proc.Id)" -ErrorAction SilentlyContinue).CommandLine
            if ($cmdLine -like "*Backend*" -or $cmdLine -like "*fanhub*") {
                Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
                Write-Host "  Stopped process PID $($proc.Id)" -ForegroundColor Yellow
                $stopped = $true
            }
        }
        catch { }
    }
}
catch { }

if (-not $stopped) {
    Write-Host "  No running backend processes found." -ForegroundColor DarkGray
}

# Brief pause to release file handles
[System.Threading.Thread]::Sleep(1500)

# ── Step 2: Delete fanhub.db so seed data is applied fresh on next startup ────
Write-Host ""
Write-Host "Step 2/3  Cleaning database..." -ForegroundColor Cyan

foreach ($file in @($DbPath, "$DbPath-wal", "$DbPath-shm")) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  Deleted $(Split-Path $file -Leaf)" -ForegroundColor Yellow
    }
}

if (-not (Test-Path $DbPath)) {
    Write-Host "  Database is clean. Seed data will apply on next startup." -ForegroundColor DarkGray
}

# ── Step 3: Add EF migration ──────────────────────────────────────────────────
Write-Host ""
Write-Host "Step 3/3  Adding migration: Add$EntityName" -ForegroundColor Cyan

Push-Location $BackendPath
try {
    dotnet ef migrations add "Add$EntityName"
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Migration failed. Fix the errors above before continuing."
        exit 1
    }

    Write-Host ""
    Write-Host "Done! Migration added successfully." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor White
    Write-Host "  1. Start the backend — it will run migrations and seed data automatically."
    Write-Host "  2. Verify: GET /api/$($EntityName.ToLower())s returns your seeded records."
}
finally {
    Pop-Location
}
