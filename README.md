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

## Architecture summary

- `client/` contains the React + Vite frontend
- `server/` contains the Express + MongoDB backend
- the frontend consumes REST APIs from `server/api/*`
- authentication is handled with JWT tokens stored on the client and verified on protected backend routes
- real-time seat locking is handled through Socket.IO
- ticket generation uses Puppeteer + QR code generation + Cloudinary upload + email delivery

## Viva / Demo talking points

### Frontend stack

- React 19 for UI and routing-driven page structure
- Vite 7 for fast local development and production builds
- React Router DOM 7 for navigation and protected flow transitions
- Tailwind CSS 4 for responsive styling
- React Query for data fetching and cache invalidation
- Axios for API communication

### Backend stack

- Express 5 for API routing and middleware
- MongoDB + Mongoose for persistent event, user, booking, and payment data
- JWT for authentication
- bcrypt for password hashing
- Zod for request validation
- Razorpay for payment order creation and verification
- Nodemailer for ticket email delivery
- Cloudinary for poster and generated ticket asset hosting
- Puppeteer + QRCode for ticket image generation

### Auth flow

1. User registers or logs in from the frontend.
2. Backend validates input, checks credentials, and returns a JWT token.
3. Frontend stores the token and sends it in the `Authorization` header for protected APIs.
4. Backend verifies the token in auth middleware before allowing protected actions.

### Payment flow

1. User selects seats and moves to the payment page.
2. Frontend creates a payment order from the backend.
3. Razorpay checkout opens with the order details.
4. After successful payment, the frontend sends payment identifiers back to the backend.
5. Backend verifies the Razorpay signature and finalizes the booking.

### Seat locking flow

1. When a user enters seat selection, the frontend joins the event room through Socket.IO.
2. Available, locked, and booked seats are synchronized in real time.
3. Locking a seat temporarily reserves it for the current user.
4. Releasing a seat or successful booking updates other connected users instantly.

### Ticket generation flow

1. After payment verification, backend creates the booking record.
2. A QR payload is generated for the ticket.
3. Ticket content is rendered and converted into an image.
4. Ticket image is uploaded to Cloudinary.
5. Ticket link and/or attachment is delivered through email and shown in booking history.

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

## Suggested demo flow

1. Register or login as a user.
2. Browse movies, sports, and events.
3. Open an event and show seat selection.
4. Move to payment and explain Razorpay verification.
5. Show booking confirmation and live ticket view.
6. Open wishlist and booking history.
7. Login as admin and show event/user/booking management.

## Available scripts

In `client`:

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

In `server`:

- `npm run dev`
- `npm start`

## Future scope

- Caching for events and high-traffic lists.
- Analytics dashboard for bookings, revenue, and popular events.
- Performance optimizations and route-level lazy loading.
- Rate limiting and security hardening on sensitive APIs.

## Authoring direction

Current baseline supports production-style booking and ticket delivery. Next milestones can focus on analytics dashboards, notification queueing, and recommendation quality tuning.
