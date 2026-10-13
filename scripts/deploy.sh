#!/usr/bin/env bash
# Build for GitHub Pages and publish dist/ to the gh-pages branch.
set -euo pipefail
cd "$(dirname "$0")/.."

REPO_URL="$(git remote get-url origin)"
REPO_NAME="$(basename -s .git "$REPO_URL")"

MSYS_NO_PATHCONV=1 BASE_PATH="/$REPO_NAME/" npm run build
touch dist/.nojekyll

cd dist
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy $(date '+%Y-%m-%d %H:%M')"
git push -q -f "$REPO_URL" gh-pages
rm -rf .git
echo "Deployed: https://$(gh api user -q .login).github.io/$REPO_NAME/"
