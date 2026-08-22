# Grocery Shop Management System

A simple full-stack grocery store management system with a fast POS, inventory ledger, GST/non-GST billing, customers, suppliers, expenses, reports, and role-based access.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MySQL
- ORM: Prisma
- Authentication: JWT + bcrypt

## Quick start

1. Install Node.js 20+, MySQL 8+, and npm.
2. Create a database named `grocery_shop`.
3. Copy `.env.example` to `backend/.env` and set the database credentials.
4. Run:

```bash
npm install
npm run install:all
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

5. Open http://localhost:5173.

Demo accounts:

- Admin: `admin` / `admin123`
- Cashier: `cashier` / `cashier123`

Change these passwords before production use.

## Project layout

- `frontend/` React user interface
- `backend/` Express REST API
- `backend/prisma/` schema and seed data
- `uploads/` reserved for shop logos and imports

## Important API endpoints

- `POST /api/auth/login`
- `GET|POST|PUT /api/products`
- `GET|POST /api/customers`
- `GET|POST /api/suppliers`
- `POST /api/purchases`
- `POST /api/sales`
- `POST /api/stock/out`
- `POST /api/expenses`
- `GET /api/dashboard`
- `GET /api/reports/sales`

Sale and purchase writes run in a Prisma database transaction. Inventory changes are recorded in `stock_transactions`. Never expose `backend/.env` or database credentials through the frontend.

## Production notes

Use HTTPS, a strong `JWT_SECRET`, a separate database user with least privilege, daily encrypted MySQL backups, a process manager such as systemd/PM2, and a reverse proxy such as Nginx. Add object storage for uploaded logos and restrict CORS to the production frontend origin.
# grocery-shop
