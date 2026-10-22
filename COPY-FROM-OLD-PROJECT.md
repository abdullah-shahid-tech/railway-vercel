# Files to copy from your old project (same folder, same name)

From `mysql-app/backend/` into `backend/`:
- schema.cloud.sql
- src/routes/cron.js   (remove any sync / supabase lines inside it)
- src/routes/data.js

From `frontend/` into `frontend/`:
- app/dashboard/   (whole folder)
- app/login/       (whole folder)
- app/register/    (whole folder)
- app/globals.css, app/layout.js, app/page.js
- components/      (whole folder)
- package.json, package-lock.json, next.config.mjs, jsconfig.json, postcss.config.mjs
  (and components.json if you have it)

Do NOT copy: node_modules, .next, .env, .env.local, sync.js, supabaseTarget.js

After copying, search for leftovers (PowerShell, from this folder):
  Get-ChildItem . -Recurse -Include *.js,*.jsx -Exclude node_modules | Select-String -Pattern "supabase|sync" -CaseSensitive:$false

Then:
  cd backend ; npm install ; npm run dev
  (create backend/.env from backend/.env.example, and frontend/.env.local from frontend/.env.example)
