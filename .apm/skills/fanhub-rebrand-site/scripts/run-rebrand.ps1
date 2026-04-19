#!/usr/bin/env pwsh
# rebrand-site/scripts/run-rebrand.ps1
#
# Helper script for FanHub site rebrand operations.
# Intended to be called by the rebrand-site skill during Phase 1 and Phase 5.
#
# Usage:
#   .\run-rebrand.ps1 -Step reset-db
#   .\run-rebrand.ps1 -Step seed-dotnet
#   .\run-rebrand.ps1 -Step restart
#   .\run-rebrand.ps1 -Step all        (reset-db + restart)

param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("reset-db", "seed-dotnet", "restart", "all")]
    [string]$Step
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$dbPath = Join-Path $repoRoot "dotnet\Backend\fanhub.db"

function Stop-DotnetBackend {
    Write-Host "⏹  Stopping dotnet Backend processes..." -ForegroundColor Yellow
    $procs = Get-CimInstance Win32_Process | Where-Object {
        $_.CommandLine -like "*dotnet*Backend*" -or $_.CommandLine -like "*dotnet*run*"
    }
    if ($procs) {
        $procs | ForEach-Object {
            Write-Host "   Stopping PID $($_.ProcessId): $($_.CommandLine.Substring(0, [Math]::Min(80, $_.CommandLine.Length)))"
            Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
        }
        Start-Sleep -Milliseconds 800
        Write-Host "   Done." -ForegroundColor Green
    }
    else {
        Write-Host "   No running dotnet Backend processes found." -ForegroundColor DarkGray
    }
}

function Remove-Database {
    Write-Host "🗑  Deleting fanhub.db and WAL/SHM files..." -ForegroundColor Yellow
    @($dbPath, "$dbPath-wal", "$dbPath-shm") | ForEach-Object {
        if (Test-Path $_) {
            Remove-Item $_ -Force
            Write-Host "   Deleted: $_" -ForegroundColor Green
        }
    }
    Write-Host "   Database cleared. App will re-seed on next startup." -ForegroundColor Green
}

function Start-DotnetBackend {
    Write-Host "▶  Starting dotnet app..." -ForegroundColor Cyan
    $startScript = Join-Path $repoRoot "dotnet\start.ps1"
    if (Test-Path $startScript) {
        Write-Host "   Running: $startScript"
        & $startScript
    }
    else {
        Write-Host "   start.ps1 not found at $startScript — run the app manually." -ForegroundColor Red
    }
}

switch ($Step) {
    "reset-db" {
        Stop-DotnetBackend
        Remove-Database
    }
    "seed-dotnet" {
        # Alias for reset-db — the app self-seeds via SeedData.Initialize() on startup
        Stop-DotnetBackend
        Remove-Database
        Write-Host "ℹ  Seed data will be applied when you next start the app." -ForegroundColor Cyan
    }
    "restart" {
        Stop-DotnetBackend
        Start-DotnetBackend
    }
    "all" {
        Stop-DotnetBackend
        Remove-Database
        Start-DotnetBackend
    }
}

Write-Host ""
Write-Host "✅ Step '$Step' complete." -ForegroundColor Green
