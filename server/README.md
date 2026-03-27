# Server

Node.js/Express backend for the My Favorite Places API.

> For full project documentation (Docker, CI/CD, testing, deployment), see the [main README](../README.md).

## Development

```bash
npm install
npm run dev
```

The server runs on port 3000 by default.

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
