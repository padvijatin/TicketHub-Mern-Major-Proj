# TicketHub

TicketHub is a full-stack MERN event-booking platform built for a major project. It includes authentication, event discovery, seat selection, live seat locking, Razorpay payments, QR-based tickets, email delivery, wishlist support, admin controls, organizer tools, validation improvements, and responsive UI polish across devices.

## Highlights

- MERN architecture with React + Vite frontend and Express + MongoDB backend
- JWT authentication with register, login, logout, Google OAuth, profile update, and password update
- Event discovery for movies, sports, and live events
- Seat selection with real-time locking
- Razorpay payment order creation and verification
- Secure ticket access with protected fetch and signed access links
- Ticket generation, Cloudinary upload, and email delivery
- Admin and organizer dashboards for events, bookings, users, and coupons
- Inline form validation with field-level error messages
- Improved status-code handling and cleaner API error display
- Mobile, tablet, and desktop responsive layouts

## Tech Stack

### Frontend

- React 19
- Vite 7
- React Router 7
- Tailwind CSS 4
- Axios
- TanStack React Query
- Swiper
- React Toastify
- Framer Motion

### Backend

- Node.js
- Express 5
- MongoDB
- Mongoose
- JWT
- bcrypt
- Zod
- Razorpay
- Nodemailer
- Cloudinary
- Puppeteer
- Socket.IO

## Main Features

### User Features

- Register and login with email/password
- Google sign-in support
- Browse movies, sports, and event listings
- Filter content by location
- Save events to wishlist
- Book seats with live availability updates
- Pay through Razorpay
- View bookings and tickets
- Update profile and password

### Ticketing Features

- QR-based ticket generation
- Ticket delivery through email
- Ticket image hosting on Cloudinary
- Auth-protected ticket fetch
- Signed access-token support for shared ticket links

### Admin / Organizer Features

- Dashboard overview with revenue and booking insights
- Event create, update, approval, and archive flows
- Booking management
- Coupon management
- User management for admins

## Security and Quality Improvements

This version includes a stronger hardening pass than the earlier baseline:

- protected ticket access instead of exposing raw booking data publicly
- payment ownership checks during verification
- role checks moved ahead of upload middleware for admin event routes
- better runtime environment validation for JWT, CORS/client URL, Cloudinary, and Razorpay setup
- improved HTTP status codes for auth, booking, contact, and payment flows
- centralized frontend API error messaging
- stronger request validation with Zod
- lint-clean frontend
- passing frontend and backend test suites

## Project Structure

```text
TicketHub/
|-- client/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- store/
|   |   |-- utils/
|   |   `-- ...
|   `-- package.json
|-- server/
|   |-- controllers/
|   |-- middlewares/
|   |-- models/
|   |-- router/
|   |-- utils/
|   |-- validators/
|   `-- package.json
|-- README.md
`-- .gitignore
```

## Routes

### Frontend

- `/`
- `/movies`
- `/sports`
- `/events`
- `/about`
- `/contact`
- `/login`
- `/register`
- `/profile`
- `/wishlist`
- `/bookings`
- `/admin`
- `/organizer`
- `/event/:id`
- `/event/:id/seats`
- `/event/:id/payment`
- `/event/:id/confirmation`
- `/ticket/:bookingId`

### Backend API Base

`http://localhost:5000/api`

### Main API Groups

- `/auth`
- `/events`
- `/bookings`
- `/payment`
- `/wishlist`
- `/coupons`
- `/admin`
- `/contact`

## Environment Setup

Environment files are ignored by git. Keep your real secrets in `server/.env` locally.

### Required backend variables

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=use_a_long_secure_secret_value
CLIENT_URL=http://localhost:5173,http://localhost:5174

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URL=http://localhost:5000/api/auth/google/callback

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=your_sender_email

CONTACT_RECEIVER_EMAIL=your_receiver_email

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Optional frontend variable

```env
VITE_API_URL=http://localhost:5000/api/auth
```

## Local Development

### 1. Install dependencies

```bash
cd server
npm install
```

```bash
cd client
npm install
```

### 2. Start backend

```bash
cd server
npm run dev
```

### 3. Start frontend

```bash
cd client
npm run dev
```

Frontend default URL: `http://localhost:5173`  
Backend default URL: `http://localhost:5000`

## Available Scripts

### Client

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run test:run`

### Server

- `npm run dev`
- `npm start`
- `npm run test:run`

## Verification

Recent verification completed on this codebase:

- frontend lint: passed
- frontend tests: passed
- backend tests: passed

## Demo Flow

1. Register or log in as a normal user.
2. Browse movies, sports, and events.
3. Open an event and show seat selection.
4. Continue to payment and explain Razorpay verification.
5. Show booking confirmation and ticket view.
6. Open wishlist and bookings.
7. Log in as admin or organizer and show dashboard tools.

## Future Scope

- analytics expansion for admin and organizer roles
- notifications and reminders
- queue-based email/ticket jobs
- caching and performance optimization
- deeper recommendation tuning
- deployment automation and monitoring

## Author

**Padvijatin**

GitHub repository: `https://github.com/padvijatin/TicketHub-Mern-Major-Proj`
