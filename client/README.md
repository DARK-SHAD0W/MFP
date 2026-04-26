# Client

Vite + React front-end for the My Favorite Places API.

For full project documentation, see the [main README](../README.md).

Useful sections:
- [Quick Start](../README.md#quick-start)
- [Docker Management](../README.md#docker-management)
- [CI/CD Pipeline](../README.md#cicd-pipeline)

## Prerequisites

- Node.js 18+
- Backend API reachable on port 3000

## Quick Start

### Option 1: Full Docker Compose stack

From the project root:

```bash
docker compose up -d --build
```

Client URL: `http://localhost:5173`

### Option 2: Client local + backend in Docker

From the project root:

```bash
docker compose up -d db server
```

Then run the client locally (commands below).

## Local Development (Manual)

From the `client` folder:

```bash
cd client
npm install
npm run dev
```

The dev server proxies `/api` to `http://localhost:3000`, so keep the server running there.

## Container Access (Project)

From the project root:

```bash
docker compose ps
docker compose logs -f client
docker compose exec client sh
```

## Build and Preview

From the `client` folder:

```bash
npm run build
npm run preview
```

## Troubleshooting

- If API calls fail, ensure server is running on `http://localhost:3000`.
- If port 5173 is busy, stop existing Vite processes and restart `npm run dev`.

