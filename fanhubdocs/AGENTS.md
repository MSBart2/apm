# FanHub Copilot Instructions

> **Active implementation**: `dotnet/` — ASP.NET Core Web API backend + Blazor Server frontend
> **Purpose**: Workshop codebase with intentional bugs. The goal is to fix them using GitHub Copilot.

---

## Project Overview

FanHub is a Breaking Bad fan site. It serves characters, episodes, quotes, lore, and show data through a REST API consumed by a Blazor Server frontend.

- **Backend**: ASP.NET Core 10 Web API — `dotnet/Backend/`
- **Frontend**: Blazor Server — `dotnet/Frontend/`
- **Database**: SQLite via Entity Framework Core 10 (file: `fanhub.db`)
- **ORM**: Direct `FanHubContext` injection — no repository layer

Other language implementations (`node/`, `go/`, `java/`) exist but are **not the focus**.

> For deep implementation details:
> - **Backend**: Routes, models, EF Core setup, seed data, configuration — see [`architecture-backend.md`](fanhubdocs/architecture-backend.md)
> - **Frontend**: Components, data fetch patterns, conventions — see [`architecture-frontend.md`](fanhubdocs/architecture-frontend.md)

---

## Key Conventions

- Controllers inject `FanHubContext` directly — no services, no repositories
- Routes follow `[Route("api/[controller]")]` — controller class name = route segment
- Async: `FindAsync()`, `ToListAsync()`, `SaveChangesAsync()`
- Frontend fetches: `await Http.GetFromJsonAsync<T>("api/endpoint")`
- No `[Authorize]` middleware enforced anywhere

---

## Reference Docs

| Document                                                                       | Purpose                                                              |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| [`architecture-backend.md`](fanhubdocs/architecture-backend.md)           | Backend: API routes, models, EF, seed data, config, security         |
| [`architecture-frontend.md`](fanhubdocs/architecture-frontend.md)         | Frontend: Blazor components, data fetch, conventions                 |
| [`dotnet/BUGS.md`](./dotnet/BUGS.md)                                           | Bug catalog with evidence and fix guidance                           |
| [`dotnet/SETUP.md`](./dotnet/SETUP.md)                                         | Detailed setup instructions                                          |
| [`fanhubdocs/breaking-bad-universe.md`](./fanhubdocs/breaking-bad-universe.md) | Domain lore: characters, locations, show history                     |
