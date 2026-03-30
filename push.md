# Push Steps

Run these from `c:\Projects\TicketHub`:

```powershell
git status
git add .
git reset HEAD -- server/uploads
git commit -m "Refine payment UI and booking admin flows"
git push origin main
```

# What Each Command Does

- `git status` checks changed files
- `git add .` stages everything
- `git reset HEAD -- server/uploads` unstages local upload files
- `git commit -m "..."` creates the commit
- `git push origin main` pushes to GitHub

# Optional Verify First

```powershell
cd client
npm run build
cd ..
Get-ChildItem server -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
```
