# Rebuilds dumpster-press-kit.zip next to this script.
# Includes: assets/, fact-sheet.md, boilerplate.txt, and ../showcase/exports/*.png (as mockups/) if present.
# Run:  powershell -ExecutionPolicy Bypass -File .\build-zip.ps1   (re-run after showcase exports change)
$ErrorActionPreference = 'Stop'
$here  = Split-Path -Parent $MyInvocation.MyCommand.Path
$zip   = Join-Path $here 'dumpster-press-kit.zip'
$stage = Join-Path ([IO.Path]::GetTempPath()) ('dumpster-press-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $stage | Out-Null
try {
  Copy-Item (Join-Path $here 'assets') (Join-Path $stage 'assets') -Recurse
  Copy-Item (Join-Path $here 'fact-sheet.md') $stage
  Copy-Item (Join-Path $here 'boilerplate.txt') $stage
  $exports = Join-Path $here '..\showcase\exports'
  $count = 0
  if (Test-Path $exports) {
    $pngs = Get-ChildItem $exports -Filter *.png -File
    if ($pngs) {
      $dest = Join-Path $stage 'mockups'
      New-Item -ItemType Directory -Path $dest | Out-Null
      $pngs | Copy-Item -Destination $dest
      $count = $pngs.Count
    }
  }
  if (Test-Path $zip) { Remove-Item $zip -Force }
  Compress-Archive -Path (Join-Path $stage '*') -DestinationPath $zip
  Write-Host "Built $zip ($count mockups included)"
} finally {
  Remove-Item $stage -Recurse -Force -ErrorAction SilentlyContinue
}
