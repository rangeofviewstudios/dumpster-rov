#!/usr/bin/env bash
# Assembles every Dumpster deliverable into deploy/dumpster-rov/ for one static Vercel site.
# Usage: bash deploy/build-site.sh   then   vercel deploy deploy/dumpster-rov --prod --yes
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/deploy/dumpster-rov"

(cd "$ROOT/app" && npm run build)

# Empty the folder rather than deleting it (Windows locks a directory that a shell has open).
mkdir -p "$OUT"
find "$OUT" -mindepth 1 -maxdepth 1 ! -name .vercel -exec rm -rf {} +
mkdir -p "$OUT/app" "$OUT/showcase"
cp "$ROOT/deploy/hub.html" "$OUT/index.html"
cp -r "$ROOT/brand" "$OUT/brand"
cp -r "$ROOT/press" "$OUT/press"
cp -r "$ROOT/moodboard" "$OUT/moodboard"
cp -r "$ROOT/app/dist/." "$OUT/app/"
cp -r "$ROOT/app/screenshots" "$OUT/app/screenshots"   # press kit falls back to these
cp -r "$ROOT/showcase/index.html" "$ROOT/showcase/exports" "$ROOT/showcase/scenes" "$ROOT/showcase/shots" "$OUT/showcase/"
rm -f "$OUT/showcase/shots/"*.mjs "$OUT/press/build-zip.ps1"

cat > "$OUT/vercel.json" <<'EOF'
{ "trailingSlash": true, "cleanUrls": false }
EOF
echo "Built $OUT ($(du -sh "$OUT" | cut -f1))"
