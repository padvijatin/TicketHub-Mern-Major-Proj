# TicketHub Client

This is the frontend for TicketHub. It includes discovery rails, booking, payment confirmation flows, ticket pages, wishlist, and admin management screens.

## Stack

- React 19
- Vite 7
- React Router DOM 7
- Tailwind CSS 4
- Axios
- React Query
- Swiper
- React Toastify

## Run locally

```bash
cd client
npm install
npm run dev
```

The development server runs on `http://localhost:5173` by default.

## Build

```bash
npm run build
```

## Environment variable

Optional:

```env
VITE_API_URL=http://localhost:5000/api/auth
```

If `VITE_API_URL` is not provided, the app uses `http://localhost:5000/api/auth`.

## Routes

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

## Current frontend coverage

- Responsive navbar/footer and shared layout
- Auth context with token persistence in `localStorage`
- Home discovery rails:
  - recommended movies/events/sports
  - popular movies/events
  - top games and sports events
- Event detail and seat selection booking flow
- Payment confirmation and booking history pages
- Live ticket view with QR and status chips
- Wishlist integration
- Admin UI for events, users, bookings, coupons
- Toast-based success and error messaging

## Styling note

The project uses the official Tailwind CSS Vite plugin and keeps the site color kit in `src/index.css` through shared CSS variables for consistent theming.
