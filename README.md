# Bellcorp Personal Expense Tracker (MERN)

A full-stack personal expense tracker built with the MERN stack: MongoDB, Express, React, and Node.js. Features JWT authentication, dashboard with totals and category summary, and a transaction explorer with search, filters, and pagination.

## Tech Stack

- **Frontend:** React 18, Vite, React Router 6, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcrypt

## Project Structure

```
bellcorp-expense-tracker-mern/
├── client/                 # React frontend (Vite)
│   ├── index.html         # Vite entry HTML
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx       # App entry
│       ├── assets/        # Global styles
│       ├── components/    # Auth, dashboard, explorer, layout
│       ├── context/       # AuthContext, TransactionContext
│       ├── hooks/
│       ├── pages/
│       ├── utils/         # Axios API layer
│       └── App.js
├── server/                 # Express backend
│   ├── config/            # DB connection
│   ├── models/            # User, Transaction
│   ├── controllers/
│   ├── routes/
│   ├── middleware/        # auth, errorHandler
│   └── server.js
└── README.md
```

## Prerequisites

- **Node.js 24** (or 18+; tested with Node 24)
- MongoDB (local or Atlas)
- npm or yarn

## Setup

### 1. Clone and install dependencies

```bash
cd bellcorp-expense-tracker-mern
npm install --prefix server
cd client && npm install
```

### 2. Environment variables

**Server** – create `server/.env` (see `server/.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bellcorp-expense
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

**Client** (optional) – create `client/.env` (see `client/.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```

For local dev, the Vite dev server proxies `/api` to `http://localhost:5000`, so you usually don’t need `VITE_API_URL` unless the API runs on a different host or port.

### 3. Run the app

**Terminal 1 – backend:**

```bash
cd server
npm run dev
```

Server runs at `http://localhost:5000`. Ensure MongoDB is running and `MONGODB_URI` is correct.

**Terminal 2 – frontend:**

```bash
cd client
npm run dev
```

Frontend runs at **`http://localhost:5173`** (Vite default).

Quick start from repo root:

```bash
npm install --prefix server
cd client && npm install && npm run dev
```

## API Overview

- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` (protected)
- **Transactions:**  
  - `GET /api/transactions/dashboard` – stats for dashboard  
  - `GET /api/transactions/categories` – distinct categories  
  - `GET /api/transactions` – list with `page`, `limit`, `search`, `category`, `dateFrom`, `dateTo`, `amountMin`, `amountMax`, `sortBy`, `sortOrder`  
  - `GET /api/transactions/:id`, `POST /api/transactions`, `PUT /api/transactions/:id`, `DELETE /api/transactions/:id` (all protected)

All transaction routes require `Authorization: Bearer <token>`.

## Features

- **Auth:** Register, login, JWT, protected routes
- **Dashboard:** Total expense, category summary, recent transactions
- **Explorer:** Pagination (load more), search (title/notes), filters (category, date range, amount range), state preserved when navigating back
- **Transactions:** Add, edit, delete with forms
- **UI:** Responsive layout, dark theme

## Frontend scripts (Vite)

| Command        | Description                |
|----------------|----------------------------|
| `npm run dev`  | Start dev server (port 5173) |
| `npm run build`| Production build → `dist/` |
| `npm run preview` | Preview production build |

## Deployment

- **Backend:** Set `PORT` and `MONGODB_URI` (e.g. MongoDB Atlas). Set a strong `JWT_SECRET`. Use `npm start` (or `node server.js`).
- **Frontend:** Set `VITE_API_URL` to your deployed API base URL (e.g. `https://api.example.com/api`). Run `npm run build` and serve the `client/dist` folder (e.g. Nginx, Vercel, Netlify).

## License

MIT
