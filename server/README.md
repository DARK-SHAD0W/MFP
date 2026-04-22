# Server

Node.js/Express backend for the My Favorite Places API.

For full project documentation, see the [main README](../README.md).

Useful sections:
- [Quick Start](../README.md#quick-start)
- [Testing](../README.md#testing)
- [CI/CD Pipeline](../README.md#cicd-pipeline)

## Prerequisites

- Node.js 18+
- PostgreSQL (via Docker Compose or local installation)

## Quick Start

### Option 1: Run server + DB with Docker Compose

From the project root:

```bash
docker compose up -d --build db server
```


### Option 2: Run server locally + DB in Docker

From the project root:

```bash
docker compose up -d db
```

Then run the server locally (commands below).

## Local Development (Manual)

From the `server` folder:

```bash
cd server
npm install
npm run dev
```
## Testing

### Jest Unit Tests

```bash
npm test
npm test -- --coverage
```

### Bruno API Tests

```bash
npm install -g @usebruno/cli
cd bruno-tests
bru run
```

Requires a running server and database. See the [main README](../README.md#testing) for details.
