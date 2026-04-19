# Push Steps

Run these from `c:\Projects\TicketHub`:

```powershell
git status
git add README.md CHANGES.md push.md client/src/components/admin/CouponManagement.jsx client/src/components/admin/EventManagement.jsx client/src/pages/Events.jsx client/src/pages/Movies.jsx client/src/pages/Sports.jsx client/src/utils/adminApi.js client/src/utils/listingFilters.js server/controllers/admin-controller.js server/controllers/event-controller.js server/router/admin-router.js
git commit -m "Add coupon editing and improve listing filters"
git push origin main
```

# What Each Command Does

- `git status` checks changed files
- `git add ...` stages the updated docs and application files for this release
- `git commit -m "..."` creates the commit
- `git push origin main` pushes to GitHub

# Verify First

```powershell
cd client
npm run lint
npm run test:run
npm run build
cd ..\server
npm run test:run
cd ..
```

# Current Release Summary

- coupon editing added in admin
- listing filters fixed and cleaned up
- suggested seat layouts updated in add-event form
- docs refreshed for GitHub
