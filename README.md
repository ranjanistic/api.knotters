# Knotters API

This repository contains source code for Knotters API, available at link in description.

## Setup

### Prerequisites

- nodeJS v14.x (tested on 16.x)
- Database connection string for API calls (MongoDB)
- npm (available with nodejs)
- Redis (6.x or above)

### Environment

Copy contents of [./env.example](.env.example) to ./env file and set appropriate values.

### Dependencies

```bash
npm install # or `npm ci`
```

## Server

```bash
node server.js
```

or for hot reload

```bash
nodemon server.js
```

## Structure

Each revision of API should be contained in a separate directory as a separate express Router.
Initially `./v1/` directory is present for the first revision of this API.
All endpoints under `v1/` revision should be contained in this directory, and similarly for other revisions.

There's no global database object. A database object is assigned to every request, and can be accessed as `req['db']`.

```js
req['db'].collection('collection_name').find(...)
```

All endpoints may return the following extra data, along with their own response data

- GET, POST, PUT etc. `Array` : To tell the API user about further endpoints from the current API path.
- comments `Array`: List of string comments for extra description or notice to API user for particular endpoints.

Every revision directory contains `collection.js` file to export the collections available in that revision.

No sensitive data should be exposed in any endpoint without proper consent.

## Testing

```bash
npm test
```

`tests` directory is contained in every revision directory.

## Footnotes

Pushing to `master` branch directly deploys code to production.
