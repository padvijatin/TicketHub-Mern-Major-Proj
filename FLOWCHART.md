# TicketHub Flowchart

This document shows the main TicketHub flow from user entry to booking, payment, ticket delivery, and admin management.

## Main Product Flow

```mermaid
flowchart TD
    A[User Opens TicketHub] --> B[Browse Home or Category Pages]
    B --> C[Open Event Details]
    C --> D{User Logged In?}
    D -- No --> E[Login or Register]
    D -- Yes --> F[Continue To Seat Selection]
    E --> F
    F --> G[Choose Seats]
    G --> H[Optional Coupon Validation]
    H --> I[Create Razorpay Order]
    I --> J[Complete Payment]
    J --> K[Verify Payment On Backend]
    K --> L[Create Booking]
    L --> M[Generate Ticket]
    M --> N[Upload Ticket Asset]
    N --> O[Send Ticket Email]
    O --> P[Show Booking Confirmation]
    P --> Q[Open Ticket View Or Booking History]
```

## Frontend Flow

```mermaid
flowchart TD
    A[React App Boot] --> B[Navbar Footer ErrorBoundary]
    B --> C[Route Rendering]
    C --> D[Home Movies Sports Events]
    C --> E[About Contact Auth]
    C --> F[Event Details]
    F --> G[Seat Selection]
    G --> H[Payment]
    H --> I[Booking Confirmation]
    I --> J[Ticket View]
    C --> K[Wishlist Profile Bookings]
    C --> L[Admin Organizer]
```

## Backend Request Flow

```mermaid
flowchart TD
    A[Incoming Request] --> B[Express App]
    B --> C[Helmet and CORS]
    C --> D[JSON Parsing]
    D --> E[Route Match]
    E --> F[Validation Middleware]
    F --> G[Auth Middleware When Needed]
    G --> H[Controller]
    H --> I[Model or Service Layer]
    I --> J[MongoDB or External Service]
    J --> K[Response]
```

## Booking and Ticket Lifecycle

```mermaid
flowchart TD
    A[Seat Selection] --> B[Seat Locking]
    B --> C[Payment Order Created]
    C --> D[Payment Verified]
    D --> E[Booking Saved]
    E --> F[Seat State Updated]
    F --> G[Ticket Generated]
    G --> H[Cloudinary Upload]
    H --> I[Email Delivery]
    I --> J[Booking Visible In History]
    J --> K[Ticket Available By Booking Id]
```

## Admin and Organizer Flow

```mermaid
flowchart TD
    A[Admin or Organizer Login] --> B[Dashboard]
    B --> C[Manage Events]
    B --> D[Manage Users]
    B --> E[Manage Bookings]
    B --> F[Manage Coupons]
    C --> G[Create Update Delete Event]
    D --> H[Update or Remove User]
    E --> I[Update or Delete Booking]
    F --> J[Create or Update Coupon]
```

