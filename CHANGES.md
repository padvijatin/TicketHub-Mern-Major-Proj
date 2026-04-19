# TicketHub Changes

## Admin Coupons and Listing Filters

- Added coupon edit support in admin with active/inactive status handling.
- Added frontend API support for coupon updates.
- Added backend coupon update endpoint with shared payload normalization and validation.
- Improved duplicate-code, expiry-date, and usage-limit validation for coupon updates.
- Updated listing filters to use proper single-select behavior for date, price, and event category.
- Removed the `Premium` price option from listing filter groups and quick filters.
- Added case-insensitive backend matching for category, language, genres, format, and tags.

## Admin Event Seat Layout Presets

- Updated suggested movie seat zones to `Recliner`, `Prime`, and `Standard` with row-based defaults.
- Updated suggested sports seat zones to the pitch-based layout shown in the admin screenshots.
- Updated suggested event seat zones to `Fan Pit`, `Gold Circle`, and `Regular` with the latest pricing and seat counts.

## Booking and Ticket Delivery

- Reworked payment-to-ticket flow to backend-first delivery.
- Added backend ticket image generation/capture with Puppeteer.
- Added Cloudinary upload and persistent ticket URL storage in bookings.
- Added Nodemailer ticket email with attachment and download CTA.
- Added retry handling for transient email/upload failures.
- Added cleanup for local temp ticket files and Cloudinary rollback paths.
- Removed Base64 dependency from post-payment ticket email flow.

## Event Discovery and Recommendations

- Added event engagement metrics (`viewCount`, `bookingCount`, `lastViewedAt`).
- Added user interest signals (`category`, `city`, `content type`) in user profile.
- Added discover feed endpoint with:
  - popular rails (bookings + views)
  - trending rails (recent + high engagement)
  - recommended rails (interest-based ranking)
- Wired frontend home rails to backend discover feed with fallback logic.

## Ticket and Booking UI

- Updated ticket page status chips to read real booking/payment values from DB.
- Improved ticket history/view consistency and runtime state messaging.

## Admin Data Consistency

- Improved admin booking delete flow:
  - seat release and event seat-state sync
  - booking count decrement
  - coupon usage rollback
  - payment booking reference cleanup
  - Cloudinary ticket image cleanup

## Validation

- Verified lint and module load checks on updated backend and frontend files.
- Verified live resend flows and DB ticket status updates during implementation.

## Latest Verification

- frontend lint: passed
- frontend tests: passed
- frontend build: passed
- backend tests: passed

## Auth UI Polish

- Added proper Google brand icon to login and register auth buttons.
- Refined auth page copy to better match TicketHub's booking-focused experience.
- Kept auth flow behavior unchanged while improving presentation and clarity.
