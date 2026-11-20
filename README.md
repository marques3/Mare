# MARÉ Platform — NestJS + TypeScript + MySQL

A working foundation for developing MARÉ into a surf platform for the Costa Vicentina. **No PHP.** This project is independent of the private prototype published through Sites and does not change its permissions.

## Included

- Node.js 24, NestJS 12, and TypeScript with strict type checking.
- MySQL 8.4 LTS, TypeORM, and explicit migrations. `synchronize` is disabled.
- The original PT/EN interface, now served by the backend. The selected language is preserved.
- Registration, login, logout, and account details. Passwords are hashed with scrypt, and sessions use revocable opaque tokens: an HttpOnly cookie is set, and only the token hash is stored.
- Profiles, language, alert preferences, favorites, and saved sessions stored in MySQL for authenticated users.
- Access to all 11 beaches, centralized forecasts, a persistent 30-minute cache, and protection against duplicate concurrent requests within a single instance.
- Explicit fallback to stale cached data, up to 3 hours old. No values are fabricated when the source fails.
- A TypeScript recommendation engine running on the **server**: two future daylight hours, limits met in both hours, a minimum compatibility score of 60, and non-overlapping selections.
- Request validation, rate limiting, origin protection, security headers, health checks, and Swagger documentation.
- Docker Compose and automated tests, including a MySQL integration test with two separate accounts.

## Easiest setup — Docker Desktop

Prerequisites: Node.js 24 to generate the configuration, and Docker Desktop with Docker Compose. On Windows, you can run this from a WSL terminal with Docker integration enabled.

```bash
node scripts/init-env.mjs
docker compose up --build
```

The first command creates `.env` with random passwords. It refuses to overwrite an existing file. Compose starts MySQL, applies migrations in a separate process, and starts the application.

- Website: http://localhost:3000
- API: http://localhost:3000/api
- Swagger: http://localhost:3000/api/docs
- Database readiness: http://localhost:3000/api/health/ready

Open **Account** (or **Conta** in the Portuguese interface) to register a user. Once you are signed in, your profile, favorites, and surf plan are associated with your account. Visitors without an account continue to use local preferences. Initial registration imports the current profile; anonymous favorites and sessions are not imported automatically. On login, account data replaces the local view.

Compose is configured for **local development**, with ports bound to `127.0.0.1`. It uses a persistent volume for data. Changing the password in `.env` after creating the volume does not automatically change the existing MySQL password.

## Development with Node in the terminal

```bash
nvm use
npm ci
node scripts/init-env.mjs
# Skip the previous command if .env already exists.
docker compose up -d db
npm run db:migrate
npm run start:dev
```

You can also use an existing MySQL 8.4 instance: configure `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER`, and `MYSQL_PASSWORD` in `.env`. If you change the website port, also update `APP_ORIGIN` to the exact origin, without a trailing slash.

```bash
npm run typecheck
npm test
npm run build
npm start
```

A globally installed Nest CLI is not required. The lockfile allows reproducible installation with `npm ci`.

## Project structure

```text
src/
  auth/             Accounts, scrypt, and revocable sessions
  profiles/         Per-user profiles, favorites, and session plans
  spots/            Catalog with stable identifiers
  forecast/         Open-Meteo provider and MySQL cache
  recommendations/  Rules engine and recommendations API
  database/         Entities, configuration, and migrations
  common/           Configuration, validation, and HTTP protection
  health/           Liveness and readiness
public/             PT/EN interface, with no direct calls to the weather provider
test/               Unit, HTTP, and integration tests
```

## Main API

| Method | Route | Authentication | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create an account and session |
| POST | `/api/auth/login` | No | Sign in |
| POST | `/api/auth/logout` | Cookie, if present | Revoke the session |
| GET | `/api/auth/me` | Yes | Retrieve the current user |
| GET | `/api/spots` | No | List beaches |
| GET | `/api/spots/:id` | No | Retrieve a beach |
| GET | `/api/forecast` | No | Retrieve forecasts and freshness status |
| POST | `/api/recommendations` | No | Compare conditions against a profile |
| GET, PUT | `/api/me/profile` | Yes | Read/save preferences |
| GET | `/api/me/favorites` | Yes | List favorites |
| PUT, DELETE | `/api/me/favorites/:spotId` | Yes | Save/remove a favorite |
| GET, POST | `/api/me/sessions` | Yes | List/save sessions |
| DELETE | `/api/me/sessions/:id` | Yes | Remove one of the user's own sessions |

Example request body for `/api/recommendations`:

```json
{
  "level": "intermediate",
  "availability": "morning",
  "scope": "all",
  "min": 0.7,
  "max": 2,
  "wind": 22,
  "favoriteIds": ["arrifana", "amado"]
}
```

The response includes `candidates`, `suggested`, `forecastFetchedAt`, `stale`, `timezone`, `method: "rules-v1"`, and `localQualityValidated: false`. The interface no longer calculates scores in the browser. Forecasts retain their original units: meters, seconds, and km/h.

Session times use **Europe/Lisbon** local time, in `YYYY-MM-DDTHH:00` format. The metadata explicitly identifies the time zone. Early-morning hours around daylight saving time transitions are not used: suggestions start no earlier than 07:00 and finish by 20:00, always within daylight hours.

To save a session, send only `spotId` and `startTime`, exactly as received in the recommendations. The server rechecks compatibility with the profile and derives the saved values; it does not accept an arbitrary client-supplied score.

## MySQL tests and CI

Standard tests use clearly identified fixtures and do not require MySQL or external calls. MySQL tests do not run as part of the standard test command and require a dedicated database with migrations applied.

```bash
# Configure MYSQL_* for a database used exclusively for testing.
npm run db:migrate
MYSQL_INTEGRATION=1 npm run test:integration
```

In PowerShell, set the variable with `$env:MYSQL_INTEGRATION = '1'`. The test uses weather fixtures, creates two accounts, and checks isolation, persistence, cookies, and session revocation on logout. The `.github/workflows/ci.yml` workflow provides MySQL 8.4 and runs these tests. No connection to your GitHub account has been created, and no remote workflow has been run.

## Weather data

Without `OPEN_METEO_API_KEY`, this foundation uses the public endpoints **for non-commercial prototyping only**. Before selling subscriptions, obtain suitable commercial access or choose another appropriately licensed source. When a key is configured, the provider uses the customer endpoints; confirm the plan, models, marine coverage, and terms of use with the provider.

The key is used only on the server. It is not written to the frontend, responses, or logs. The displayed wave height is **offshore significant wave height**; the application does not predict breaking wave height, tides, currents, actual shelter, seabed conditions, or crowd levels. The assessment uses an initial rule set, not a trained AI model.

The cache is shared by all visitors **within a single instance**. Across multiple replicas, the MySQL cache is shared, but concurrent request coordination and rate limiting remain local to each process. Before scaling, add shared coordination and rate limiting, for example with Redis.

## Path to production

1. Create your own repository from this code and enable the CI workflow.
2. Provision Node/Docker hosting and MySQL separately from local environments. Create separate users for migrations and runtime access, with appropriate privileges.
3. Configure the production environment: `NODE_ENV=production`, `APP_ORIGIN=https://your-domain`, strong credentials, a commercial API key, and a MySQL connection using TLS. If necessary, set `MYSQL_SSL_CA_FILE` to the provider's CA certificate.
4. Build the image. Apply migrations as a release task and run `node dist/main.js` behind an HTTPS reverse proxy. The cookie is Secure in production. The included Compose configuration forces development mode for local use and must be adapted before any public exposure.
5. Set `ENABLE_DOCS=false` in production, configure backups with tested restores, and monitor `/api/health/ready`.
6. Configure trust proxy for your known topology and add shared rate limiting before deploying multiple replicas. Do not blindly trust `X-Forwarded-For`.

This project is not compatible with the Sites Cloudflare Workers runtime because it depends on Node and a MySQL TCP connection. The published prototype remains independent. No paid infrastructure was created or deployed while preparing this project.

## Still required before selling subscriptions

- Email verification, password recovery, account management/deletion, and handling of users' rights.
- Stripe payments and subscriptions, verified and idempotent webhooks, backend premium authorization, and cancellations.
- Scheduled forecast collection, an alert queue, deduplication, scheduling, and actual email/push delivery. Saving alert preferences **does not** enable background delivery in this version.
- Historical issued forecasts, local observations, and per-beach assessment/calibration. The current table stores only the latest cache, not a training dataset.
- Terms of service, privacy, invoicing, and the service's tax arrangements.
- Security and operational review before exposing accounts to real customers. Registration may reveal that an email address already exists; current limits are per IP/process.

The recommended next increment is to complete the account lifecycle, including verification and recovery, then add local observations and email alerts. Subscriptions can be connected once the usefulness of the recommendations has been validated.
