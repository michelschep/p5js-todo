#!/usr/bin/env pwsh
# Ralph Wiggum Loop — GitHub Copilot CLI + OpenSpec editie
#
# OpenSpec verzorgt planning (specs, proposal, tasks.md).
# Ralph Wiggum implementeert: één taak per sessie, commit, herhaal.
#
# Vereisten:
#   - GitHub Copilot CLI: winget install GitHub.Copilot
#   - OpenSpec: npm install -g @fission-ai/openspec@latest
#
# Usage:
#   .\loop.ps1              # onbeperkt iteraties (Ctrl+C om te stoppen)
#   .\loop.ps1 10           # max 10 iteraties

param(
    [int]$MaxIterations = 0
)

function Get-NextTask {
    $taskFiles = Get-ChildItem -Path "openspec/changes" -Filter "tasks.md" -Recurse -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -notmatch "\\archive\\" }

    foreach ($file in $taskFiles) {
        $next = Get-Content $file.FullName |
            Where-Object { $_ -match '^\s*-\s+\[ \]' } |
            Select-Object -First 1
        if ($next) {
            return @{ Task = $next.Trim(); File = $file.FullName }
        }
    }
    return $null
}

function Get-PendingCount {
    $taskFiles = Get-ChildItem -Path "openspec/changes" -Filter "tasks.md" -Recurse -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -notmatch "\\archive\\" }

    $count = 0
    foreach ($file in $taskFiles) {
        $count += (Get-Content $file.FullName | Where-Object { $_ -match '^\s*-\s+\[ \]' }).Count
    }
    return $count
}

$CurrentBranch = git branch --show-current 2>$null
$Iteration = 0

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🐣 Ralph Wiggum Loop — Copilot CLI + OpenSpec" -ForegroundColor Cyan
Write-Host "   Branch: $CurrentBranch" -ForegroundColor Cyan
if ($MaxIterations -gt 0) {
    Write-Host "   Max:    $MaxIterations iteraties" -ForegroundColor Cyan
}
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# Controleer of openspec aanwezig is
if (-not (Test-Path "openspec/changes")) {
    Write-Host "`n⚠️  Geen openspec/changes gevonden." -ForegroundColor Yellow
    Write-Host "   Maak eerst een change aan met OpenSpec:" -ForegroundColor Yellow
    Write-Host "   1. Start Copilot CLI" -ForegroundColor DarkGray
    Write-Host "   2. Typ: /opsx:new <feature-naam>" -ForegroundColor White
    Write-Host "   3. Typ: /opsx:ff" -ForegroundColor White
    Write-Host "   4. Sluit Copilot en run opnieuw: .\loop.ps1" -ForegroundColor DarkGray
    exit 0
}

while ($true) {
    if ($MaxIterations -gt 0 -and $Iteration -ge $MaxIterations) {
        Write-Host "`n🏁 Max iteraties bereikt: $MaxIterations" -ForegroundColor Yellow
        break
    }

    $nextTask = Get-NextTask
    if (-not $nextTask) {
        Write-Host "`n🎉 Alle taken voltooid! Vergeet niet: /opsx:archive" -ForegroundColor Green
        break
    }

    $remaining = Get-PendingCount
    Write-Host "`n════════════════ LOOP $($Iteration + 1) ($remaining taken resterend) ════════════════" -ForegroundColor Green
    Write-Host "`n📋 Volgende taak:" -ForegroundColor Cyan
    Write-Host "   $($nextTask.Task)" -ForegroundColor White
    Write-Host "   in: $($nextTask.File)" -ForegroundColor DarkGray

    Write-Host "`n▶  Copilot CLI starten..." -ForegroundColor Yellow
    Write-Host "   1. Typ: /allow-all" -ForegroundColor DarkGray
    Write-Host "   2. Shift+Tab → autopilot mode" -ForegroundColor DarkGray
    Write-Host "   3. Typ: implement the next task" -ForegroundColor White
    Write-Host ""

    copilot --experimental

    # Push na elke voltooide sessie
    Write-Host "`n📤 Pushen naar origin/$CurrentBranch..." -ForegroundColor Cyan
    git push origin $CurrentBranch 2>$null
    if ($LASTEXITCODE -ne 0) {
        git push -u origin $CurrentBranch
    }

    $Iteration++

    $remaining = Get-PendingCount
    if ($remaining -eq 0) {
        Write-Host "`n🎉 Alle taken voltooid! Vergeet niet: /opsx:archive" -ForegroundColor Green
        break
    }

    Write-Host "`n$remaining taak(en) resterend. Doorgaan? [Y/N] " -ForegroundColor Cyan -NoNewline
    $continue = Read-Host
    if ($continue -notmatch '^[Yy]') { break }
}

Write-Host "`n✅ Ralph loop klaar na $Iteration iteratie(s)." -ForegroundColor Cyan
