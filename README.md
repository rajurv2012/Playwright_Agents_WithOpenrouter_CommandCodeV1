# Playwright Test Automation Framework

A comprehensive test automation framework built with Playwright supporting Web UI, API, and Database testing.

## Project Structure

```
├── .env                          # Environment variables (app URLs, credentials, DB config)
├── api/
│   ├── endpoints/routes.ts       # Centralized API routes
│   └── schemas/                  # JSON schemas for request/response validation
├── fixtures/
│   └── pageFixtures.ts           # Custom fixtures exposing Page Objects
├── pages/                        # Page Object classes (one per file, PascalCase)
├── prompts/
│   └── test-scenarios.md         # Test scenario documentation
├── tests/
│   ├── web/                      # Web UI tests (use custom page fixtures)
│   ├── api/                      # REST API tests (use request fixture & api/)
│   └── db/                       # Database-backed tests
├── testdata/                     # Static test data (JSON, CSV, XLSX)
└── utils/                        # Reusable utilities (DB client, data generators, helpers)
```

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run install:browsers
```

### Configuration

1. Copy `.env.example` to `.env` and update values:
   ```bash
   cp .env.example .env
   ```

2. Update `playwright.config.ts` if needed (baseURL, browsers, etc.)

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:web    # Web UI tests
npm run test:api    # API tests
npm run test:db     # Database tests

# Run with UI mode
npm run test:ui

# Run headed (visible browser)
npm run test:headed

# Debug mode
npm run test:debug

# View HTML report
npm run test:report
```

## Writing Tests

### Web UI Tests

Use custom page fixtures from `fixtures/pageFixtures.ts`:

```typescript
import { test, expect } from '../fixtures/pageFixtures';

test('should login successfully', async ({ loginPage, dashboardPage }) => {
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
  await dashboardPage.expectDashboardLoaded();
});
```

### API Tests

Use Playwright's built-in `request` fixture with centralized routes:

```typescript
import { test, expect } from '@playwright/test';
import { routes } from '../../api/endpoints/routes';
import { loginResponseSchema } from '../../api/schemas';

test('should login via API', async ({ request }) => {
  const response = await request.post(routes.auth.login, {
    data: { email: 'user@example.com', password: 'password' }
  });
  expect(response.ok()).toBeTruthy();
  
  const body = await response.json();
  // Validate with JSON schema
});
```

### Database Tests

Use the database client from `utils/database.ts`:

```typescript
import { test, expect } from '@playwright/test';
import { db } from '../../utils/database';
import { generateUser } from '../../utils/testDataGenerator';

test('should create and retrieve user', async () => {
  const user = generateUser();
  const created = await db.users.insert(user);
  const found = await db.users.findById(created.id);
  expect(found).toEqual(created);
});
```

## Page Object Pattern

All UI selectors and interactions are encapsulated in Page Object classes in `pages/`:

- `LoginPage.ts` - Login page interactions
- `DashboardPage.ts` - Dashboard navigation and actions
- `UsersPage.ts` - User management CRUD operations
- `ProductsPage.ts` - Product management CRUD operations
- `OrdersPage.ts` - Order management and status updates

## API Routes & Schemas

- **Routes**: `api/endpoints/routes.ts` - Centralized endpoint definitions
- **Schemas**: `api/schemas/index.ts` - JSON schemas for validation using AJV

## Test Data

- Static data: `testdata/` (JSON files for users, products, orders)
- Dynamic data: `utils/testDataGenerator.ts` (Faker.js-based generators)

## Utilities

- `utils/database.ts` - PostgreSQL client with CRUD operations
- `utils/testDataGenerator.ts` - Test data generation with Faker.js
- `utils/helpers.ts` - Common test helper functions

## CI/CD Integration

The framework outputs:
- HTML report: `test-results/html-report/`
- JSON results: `test-results/results.json`
- JUnit XML: `test-results/results.xml`

Configure your CI to publish these artifacts.

## Best Practices

1. **Page Objects**: All selectors and UI interactions in `pages/`
2. **Fixtures**: Use custom fixtures from `fixtures/pageFixtures.ts` for web tests
3. **Routes**: Import API endpoints from `api/endpoints/routes.ts`
4. **Schemas**: Validate API responses with schemas from `api/schemas/`
5. **Environment**: Load config from `.env` via `dotenv`
6. **Test Data**: Store static data in `testdata/`, generate dynamic data via `utils/testDataGenerator.ts`
7. **Database**: Use `utils/database.ts` for DB operations in `tests/db/`

## License

ISC