Starting the proj:
-- npx create-expo-app@latest GoBit --template blank-typescript

-- Set-Location "D:\Project 26X\GoBit"
-- npm install 



Set-Location

installing:
npm install --save-dev @expo/ngrok@^4.1.0

npx expo start 

verify:
npm list @expo/ngrok

run:
npx expo start --tunnel

## new adb mode 

# GoBit — Daily Development Setup

## Step 1 — Connect Android phone

- Connect the phone using a USB data cable.
- Ensure USB debugging is enabled.
- Allow USB debugging authorization if requested.
- Keep the cable connected during development.

## Step 2 — Terminal 1: Backend

Open VS Code PowerShell.

```powershell
Set-Location "D:\Project 26X\GoBit"
Set-Location server
npm run dev
```

Keep this terminal running.

## Step 3 — Terminal 2: Frontend and ADB

Open another PowerShell terminal.

```powershell
Set-Location "D:\Project 26X\GoBit"

adb devices

adb reverse tcp:5000 tcp:5000

adb reverse tcp:8082 tcp:8082

adb reverse --list

npx expo start --localhost --port 8082
```

Once Expo starts, press `a` to launch GoBit on the connected Android phone.

## Step 4 — Verify application

- Check the database connection indicator.
- Confirm GET requests return HTTP 200.
- Confirm new activities can be saved.
- Keep both terminals running.

## Step 5 — View database records

Open pgAdmin 4 → gobit database → Query Tool.

```sql
SELECT * FROM public.activities;
```

## Important rules

- Use port 8082 for Expo.
- Use port 5000 for Express.
- Use port 5432 for PostgreSQL.
- Do not interfere with port 8081.
- Do not use Expo tunnel mode for the standard USB development workflow.
- Do not change IP addresses when switching Wi-Fi networks.
- Repeat ADB forwarding when starting a new development session.
- Use `--clear` only when troubleshooting Metro cache issues.
- If another phone is used, enable USB debugging and configure ADB forwarding on that phone.

## Environment configuration

Root `.env`:

```dotenv
EXPO_PUBLIC_API_URL=http://127.0.0.1:5000
```

Backend `server/.env`:

```dotenv
PORT=5000
HOST=0.0.0.0
```

Preserve the existing DATABASE_URL and database credentials.

Never publish actual database credentials to GitHub.