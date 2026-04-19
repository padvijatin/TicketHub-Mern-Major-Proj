# TicketHub

TicketHub is a full-stack MERN ticket-booking platform for movies, sports, and live events. The project includes authentication, discovery rails, event detail pages, seat selection, Razorpay payments, QR ticket delivery, wishlist support, contact handling, and admin or organizer management tools.

## What The Project Covers

- user registration, login, logout, profile update, and password update
- Google OAuth entry flow
- movies, sports, and live event discovery pages
- home discovery feed with recommended, popular, and trending content
- event details, ratings, location display, and poster-heavy hero layouts
- seat selection with live seat locking support
- Razorpay order creation and payment verification
- booking confirmation, booking history, and ticket view pages
- QR ticket generation, Cloudinary upload, and email delivery
- wishlist sync between UI and backend
- coupon validation and admin coupon management
- admin or organizer dashboards for events, users, bookings, and coupons

## Application Areas

### Frontend

- React 19 with Vite 7
- React Router 7 navigation
- Tailwind CSS 4 styling
- TanStack React Query data fetching
- Swiper-based hero and content carousels
- Framer Motion interactions
- React Toastify feedback messaging

### Backend

- Express 5 API server
- MongoDB with Mongoose models
- JWT-based protected routes
- Zod validation middleware
- Razorpay payment integration
- Nodemailer email delivery
- Cloudinary media hosting
- Socket.IO seat-lock support

## Main Routes

### Frontend routes

- `/`
- `/movies`
- `/sports`
- `/events`
- `/about`
- `/contact`
- `/login`
- `/login/:audience`
- `/register`
- `/register/:audience`
- `/profile`
- `/wishlist`
- `/bookings`
- `/event/:id`
- `/event/:id/seats`
- `/event/:id/payment`
- `/event/:id/confirmation`
- `/ticket/:bookingId`
- `/admin`
- `/organizer`

### Backend API groups

- `/api/auth`
- `/api/events`
- `/api/bookings`
- `/api/payment`
- `/api/wishlist`
- `/api/coupons`
- `/api/admin`
- `/api/contact`

## Current UI and Product Work Included

- refreshed home hero with split content and floating poster card treatment
- reusable `HeroPosterCard` component for hero sections
- redesigned listing hero banners for movies, sports, and live events
- rebuilt event details hero with category, date, time, and venue chips
- consistent poster rendering through shared CSS utility classes
- About page heading polish
- existing booking, auth, admin, and ticket flows preserved

## Verification Status

The following checks were run successfully on April 19, 2026:

- frontend lint: `npm.cmd run lint`
- frontend tests: `npm.cmd run test:run`
- frontend build: `npm.cmd run build`
- backend tests: `npm.cmd run test:run`

Frontend build note:

- Vite completed the production build successfully.
- The build reported a large chunk warning for the main frontend bundle, which is a performance note rather than a failed build.

## Local Setup

### 1. Install dependencies

```bash
cd server
npm install
cd ../client
npm install
```

### 2. Start the backend

```bash
cd server
npm run dev
```

### 3. Start the frontend

```bash
cd client
npm run dev
```

- frontend default URL: `http://localhost:5173`
- backend default URL: `http://localhost:5000`

## Environment

Create `server/.env` and add your real project secrets.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=use_a_long_secure_secret
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

Optional frontend variable:

```env
VITE_API_URL=http://localhost:5000/api
```

## Project Documents

- [CHANGES.md](./CHANGES.md) for the consolidated change summary
- [FLOWCHART.md](./FLOWCHART.md) for the project flow and lifecycle diagrams
- [client/README.md](./client/README.md) for frontend-specific notes
- [server/README.md](./server/README.md) for backend-specific notes
- [push.md](./push.md) for push and verification commands

## Repository

- GitHub: `https://github.com/padvijatin/TicketHub-Mern-Major-Proj`

