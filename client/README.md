# TicketHub Client

This frontend powers discovery, booking, payment, ticket viewing, wishlist management, profile pages, and admin-facing screens for TicketHub.

## Frontend Stack

- React 19
- Vite 7
- React Router DOM 7
- Tailwind CSS 4
- Axios
- TanStack React Query
- Swiper
- Framer Motion
- React Toastify
- Vitest with Testing Library

## Frontend Pages

- home discovery page
- movies listing page
- sports listing page
- live events listing page
- event details page
- seat selection page
- payment page
- booking confirmation page
- ticket view page
- wishlist page
- booking history page
- profile page
- login and register pages
- contact page
- about page
- admin page
- organizer page

## UI Highlights

- cinematic hero layouts with layered poster backdrops
- reusable hero poster side card
- page hero carousels for content categories
- responsive event cards and listing grids
- map support on event details
- coupon entry and booking summary support
- global toast messaging
- route-level error boundary handling

## State and Data

- auth state through context
- wishlist state through context
- location selection through context
- React Query for async fetching and caching
- socket client support for seat-locking flows

## Frontend Scripts

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run test:run
```

## Frontend Environment

Optional variable:

```env
VITE_API_URL=http://localhost:5000/api
```

If `VITE_API_URL` is not set, the app falls back to the local backend API configuration used by the project utilities.

## Frontend Verification

Verified on April 19, 2026:

- `npm.cmd run lint` passed
- `npm.cmd run test:run` passed
- `npm.cmd run build` passed

Test coverage in this repo currently includes:

- shared booking data utilities
- seat layout utilities
- location utility behavior
- shared footer rendering
- brand logo rendering

## Frontend File Areas

- `src/pages` for route-level screens
- `src/components` for shared UI
- `src/components/admin` for admin modules
- `src/components/booking` for seat-layout experiences
- `src/store` for auth, wishlist, and location state
- `src/utils` for API calls, filters, form validation, and booking helpers

