#!/bin/bash
# usage: ./export.sh [scene-name...]  (renders scenes/*.html to exports/*.png at 2x)
cd "$(dirname "$0")"
C="/c/Program Files/Google/Chrome/Application/chrome.exe"
names=("$@"); [ ${#names[@]} -eq 0 ] && names=($(ls scenes/[0-9]*.html | sed 's#scenes/##;s#.html##'))
for n in "${names[@]}"; do
  w=$(grep -o '\-\-w:[0-9]*' scenes/$n.html | head -1 | cut -d: -f2); h=$(grep -o '\-\-h:[0-9]*' scenes/$n.html | head -1 | cut -d: -f2)
  "$C" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 --window-size=$w,$h --virtual-time-budget=10000 --screenshot="$(pwd -W)/exports/$n.png" "file:///$(pwd -W)/scenes/$n.html" 2>/dev/null
  echo "$n ${w}x${h}"
done
