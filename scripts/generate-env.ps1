$ErrorActionPreference = "Stop"

# Read version
$APP_VERSION = (Get-Content VERSION -Raw).Trim()

# Copy template
Copy-Item .env.local .env -Force

# Replace APP_VERSION line
$content = Get-Content .env
$content = $content -replace '^APP_VERSION=.*$', "APP_VERSION=$APP_VERSION"
Set-Content .env $content

Write-Host ".env generated from .env.local with APP_VERSION=$APP_VERSION"