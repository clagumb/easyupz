# AGENTS.md — Project Guidelines for AI Agents

This file provides project-specific context and conventions for AI coding agents working on **easyupz**.

## Project Overview

**easyupz** is a Go web application for managing teacher working hours (_Unterrichtspflichtzeiten_) at vocational schools in Bavaria, Germany. It covers teacher management, school-year configuration, reductions (_Ermäßigungen_), allowances (_Anrechnungen_), and overall workload views (_Gesamtansicht_).

## Language

- **Code comments and variable/type names** are in **German** (e.g., `Lehrer`, `Schuljahr`, `Ermaessigung`). Follow this convention strictly.
- **This file and commit messages** may be written in English or German — match the language of the surrounding context.

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Language   | Go 1.23                             |
| Web        | Gin (`github.com/gin-gonic/gin`)    |
| Database   | SQLite via GORM (`gorm.io/gorm`)    |
| Sessions   | `github.com/gin-contrib/sessions`   |
| Config     | INI files via `gopkg.in/ini.v1`     |
| Frontend   | Embedded static files (`embed.FS`)  |
| Crypto     | `golang.org/x/crypto`               |

## Project Structure

```
main.go            — entry point; loads config, starts Gin server
router/            — route registration
handlers/          — HTTP handler functions (one file per domain)
services/          — business logic, DB access, config loading
models/            — GORM model structs
dtos/              — request/response data transfer objects
dateutil/          — date/time helper utilities
config/            — INI configuration files
data/              — SQLite database files
start/             — embedded frontend assets (HTML/JS/CSS)
frontend/          — frontend source files
```

## Go Conventions

- Use **Go 1.23 idioms**: `any` instead of `interface{}`, `for i := range n`, `slices.Contains`, `errors.Is`, `maps.Clone`, etc.
- Prefer `max(a, b)` / `min(a, b)` over if/else comparisons.
- Use `errors.Join` to combine multiple errors.
- All model structs use GORM tags; follow existing struct patterns in `models/`.
- Handler functions receive `*gin.Context` and follow the pattern in existing handler files.
- Services handle all DB interactions — handlers must not access the DB directly.

## Naming Conventions

- **Models/DTOs**: PascalCase, German domain terms (e.g., `Lehrereinsatz`, `Wochenfaktoren`).
- **Handler files**: named after the domain in lowercase (e.g., `ermaessigungen.go`).
- **Service functions**: descriptive German verbs or nouns (e.g., `GetLehrer`, `UpdateSchuljahr`).
- Avoid abbreviations unless they already exist in the codebase.

## Database

- SQLite database managed by GORM with auto-migration.
- DB access lives exclusively in `services/db.go` and related service files.
- Use GORM associations and preloading where appropriate; avoid raw SQL unless necessary.

## Configuration

- Server IP and port are read from an INI config file via `services.NewConfigLoader()`.
- Do not hardcode server addresses or credentials.

## Authentication & Sessions

- Session-based authentication is implemented in `handlers/auth.go` and `handlers/sessiontracker.go`.
- Password hashing uses `golang.org/x/crypto`.
- All protected routes must go through the session-check middleware registered in `router/`.

## Frontend

- Static assets are embedded into the binary using `//go:embed start/*`.
- Do not add heavy external frontend build steps; keep the frontend self-contained in `start/` and `frontend/`.

## Testing

- When adding new features, write tests covering the core logic in the relevant `services/` file.
- Use Go's standard `testing` package.
- Run tests with `go test ./...` from the project root.

## Common Pitfalls

- Always check for `nil` errors returned from GORM calls before using the result.
- The embedded `staticFiles` and `indexHtml` variables are populated at build time — changes to `start/` require a rebuild.
- Config loading panics intentionally on startup if the config file is missing or malformed — this is by design.
