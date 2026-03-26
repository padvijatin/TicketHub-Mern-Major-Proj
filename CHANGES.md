# TicketHub Changes

## Wishlist

- Added a real wishlist flow on the client with a dedicated wishlist page.
- Added a wishlist icon in the navbar and connected card heart actions to the shared wishlist state.
- Connected wishlist APIs on the backend and added a dedicated `wishlist` MongoDB model/collection.
- Added server-side wishlist add, remove, clear, fetch, and sync handling.

## Home Page

- Updated the home page to use swipeable rails with existing shared cards.
- Added separate recommendation rails for movies, events, and sports.
- Added `Popular Movies`, `Popular Events`, and `Top Games & Sport Events` sections.
- Added `See all` links for each rail so navigation points to the correct page.

## Cards

- Unified shared card sizing so movies, sports, and events render with the same dimensions.
- Fixed swiper slide wrappers on the home page so rail cards keep equal height.
- Added a compact real-world rating display using Lucide React: one star icon and numeric rating.

## Routing and Shared State

- Registered the wishlist route in the client router.
- Wrapped the app with the wishlist provider.
- Kept the existing card design and reused shared components instead of introducing a new card layout.

## Verification

- Verified client builds successfully with `npm run build`.
- Verified updated server files with `node --check`.
