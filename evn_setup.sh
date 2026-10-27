#!/bin/bash

echo "=========================================="
echo " Environment Setup - Playwright + opencart"
echo "=========================================="

echo "[1/7] Installing test data, env vars, date/time handling..."
npm install dotenv @faker-js/faker luxon || exit 1

echo "[2/7] Installing API / data validation..."
npm install ajv csv-parse xlsx || exit 1

echo "[3/7] Installing accessibility testing (WCAG)...
npm install @axe-core/playwright || exit 1

echo "[4/7] Installing Allure reporting..."
npm install allure-playwright || exit 1

echo "[5/7] Installing Node.js TypeScript type definitions..."
npm install -D @types/node || exit 1

echo "[6/7] Installing Playwright browser binaries..."
npx playwright install || exit 1

echo "[7/7] Installing MySQL DB validation / DML..."
npm install mysql2 || exit 1

echo ""
echo "=========================================="
echo " Environment setup completed successfully!"
echo "=========================================="