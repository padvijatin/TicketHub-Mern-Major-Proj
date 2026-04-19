# Push Guide

Run these commands from `c:\Projects\TicketHub`.

## Verify Before Push

```powershell
cd client
npm.cmd run lint
npm.cmd run test:run
npm.cmd run build
cd ..\server
npm.cmd run test:run
cd ..
```

## Stage, Commit, And Push

```powershell
git status
git add README.md CHANGES.md FLOWCHART.md push.md client/README.md server/README.md client/src/components/EventCard.jsx client/src/components/HeroCarousel.jsx client/src/components/HeroPosterCard.jsx client/src/components/PageHeroCarousel.jsx client/src/index.css client/src/pages/About.jsx client/src/pages/EventDetails.jsx client/src/pages/Home.jsx
git commit -m "Improve docs and refresh hero experience"
git push origin main
```

## Verified Status

Verified on April 19, 2026:

- frontend lint passed
- frontend tests passed
- frontend build passed
- backend tests passed

## GitHub Remote

- `origin`: `https://github.com/padvijatin/TicketHub-Mern-Major-Proj.git`

