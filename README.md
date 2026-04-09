# TicketHub MERN Project

TicketHub is a full-stack MERN ticketing platform with booking, seat locking, payments, ticket delivery, admin tools, wishlist, and recommendation rails. The app runs with a React + Vite frontend and an Express + MongoDB backend.

## Current status

- Frontend: React 19, Vite 7, React Router 7, Tailwind CSS 4, Axios, React Query, Swiper, React Toastify.
- Backend: Express 5, MongoDB + Mongoose, JWT auth, bcrypt, Zod validation, Razorpay, Nodemailer, Cloudinary, Puppeteer.
- Authentication, event discovery, booking + payment, ticket generation + email, admin management, and user booking history are all implemented.

## Core features

- JWT auth with register, login, logout, and protected user fetch
- Event listing with content-type routing (movies, sports, events) and location-aware filtering
- Seat-zone booking flow with seat locks and booking confirmation
- Razorpay payment verification and booking finalization
- Ticket email pipeline:
  - payment success
  - ticket image generation/capture
  - Cloudinary upload
  - email attachment + download link
- Booking history and live ticket view with QR
- Wishlist with add/remove/sync
- Admin panel for events, users, bookings, coupons
- Recommendation feed:
  - popular (bookings/views)
  - trending (recent + high engagement)
  - recommended (user interest signals: category/city/type)

## Tech stack

- Frontend: React, Vite, React Router DOM, Tailwind CSS, Axios, React Toastify
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Zod

## Project structure

```text
TicketHub/
|-- client/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- store/
|   |   `-- utils/
|   |-- package.json
|   `-- README.md
|-- server/
|   |-- controllers/
|   |-- middlewares/
|   |-- models/
|   |-- router/
|   |-- utils/
|   |-- validators/
|   |-- server.js
|   |-- package.json
|   `-- README.md
`-- README.md
```

## Frontend routes

- `/`
- `/movies`
- `/sports`
- `/events`
- `/about`
- `/contact`
- `/admin`
- `/register`
- `/login`
- `/logout`

## Backend APIs

Base API URL: `http://localhost:5000/api`

- Auth: `/auth/*`
- Events: `/events/*`
- Bookings: `/bookings/*`
- Payment: `/payment/*`
- Wishlist: `/wishlist/*`
- Coupons: `/coupons/*`
- Admin: `/admin/*`

## Environment variables

Backend values are loaded from `server/.env`.

Required server variables:

- `PORT=5000`
- `MONGODB_URI=your_mongodb_connection_string`
- `JWT_SECRET=your_secret_key`
- `CLIENT_URL=http://localhost:5173,http://localhost:5174`
- `RAZORPAY_KEY_ID=...`
- `RAZORPAY_KEY_SECRET=...`
- `SMTP_HOST=...`
- `SMTP_PORT=587`
- `SMTP_SECURE=false`
- `SMTP_USER=...`
- `SMTP_PASS=...`
- `SMTP_FROM=...`
- `CLOUDINARY_CLOUD_NAME=...`
- `CLOUDINARY_API_KEY=...`
- `CLOUDINARY_API_SECRET=...`

Optional client variable:

- `VITE_API_URL=http://localhost:5000/api/auth`

The frontend already falls back to `http://localhost:5000/api/auth` if `VITE_API_URL` is not set.

## Local setup

### 1. Install dependencies

```bash
cd server
npm install
```

```bash
cd client
npm install
```

### 2. Configure the backend

Create `server/.env` from `server/.env.example` and add your real MongoDB URI and JWT secret.

### 3. Start the backend

```bash
cd server
npm run dev
```

### 4. Start the frontend

```bash
cd client
npm run dev
```

Frontend default URL: `http://localhost:5173`  
Backend default URL: `http://localhost:5000`

## Notes

- Auth tokens are stored in `localStorage`.
- CORS allows localhost + origins listed in `CLIENT_URL`.
- Event popularity uses persisted event metrics (`viewCount`, `bookingCount`).
- Personalized recommendations use stored user interest signals.

## Available scripts

In `client`:

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

In `server`:

- `npm run dev`
- `npm start`

## Authoring direction

Current baseline supports production-style booking and ticket delivery. Next milestones can focus on analytics dashboards, notification queueing, and recommendation quality tuning.
