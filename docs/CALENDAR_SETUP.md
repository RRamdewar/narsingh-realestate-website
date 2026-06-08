# Calendar & Availability Setup

This site has two calendar features that read from Microsoft 365 / Outlook:

| Page | URL | Who it's for | How it reads the calendar |
|------|-----|--------------|---------------------------|
| **My Calendar** | `/#/calendar` | You (the agent) | Live, via the **Microsoft Graph API** after you sign in |
| **Availability** | `/#/availability` | The public — anyone with the link | Your **published Outlook calendar** (free/busy only) |

> **Why two different methods?** GitHub Pages is a static host with no backend
> or database. A signed-in agent can read their own calendar straight from
> Microsoft Graph in the browser. But anonymous visitors can't sign in as you,
> so the public availability page reads a read-only *published* calendar feed
> that shows only when you're busy — no event titles or details leak.

Everything is configured with environment variables (no secrets in code). For a
deployed site, set them as **GitHub Actions Variables**; for local development,
copy `.env.example` to `.env.local`.

---

## Part 1 — "My Calendar" (Microsoft Graph sign-in)

### 1. Register an app in Azure

1. Go to the [Azure Portal](https://portal.azure.com) → **Microsoft Entra ID**
   → **App registrations** → **New registration**.
2. Name it e.g. `Narsingh Team Website`.
3. **Supported account types**: choose based on your account:
   - Microsoft 365 work/school account → *Accounts in this organizational directory only*.
   - Personal Outlook.com account → *Personal Microsoft accounts only*.
   - Either → *Accounts in any org directory and personal Microsoft accounts*.
4. **Redirect URI**: platform **Single-page application (SPA)**, value:
   - Local dev: `http://localhost:5173`
   - Production: `https://rramdewar.github.io/narsingh-realestate-website/`
   (You can add more than one. They must match exactly, trailing slash included.)
5. Click **Register** and copy the **Application (client) ID**.

### 2. Add the calendar permission

1. In the app → **API permissions** → **Add a permission** → **Microsoft Graph**
   → **Delegated permissions**.
2. Add **`Calendars.Read`** and **`User.Read`**.
3. (Work/school accounts) Click **Grant admin consent** if required by your tenant.

### 3. Configure the site

Set these values (Client ID is from step 1):

```
VITE_MS_CLIENT_ID=00000000-0000-0000-0000-000000000000
VITE_MS_AUTHORITY=https://login.microsoftonline.com/common
VITE_OWNER_NAME=Brandon Narsingh
VITE_OWNER_EMAIL=brandon@narsinghteam.com
```

Pick the authority that matches your account type:
- Work/school only: `https://login.microsoftonline.com/<your-tenant-id>`
- Personal only: `https://login.microsoftonline.com/consumers`
- Both: `https://login.microsoftonline.com/common`

Now open `/#/calendar`, click **Sign in with Microsoft**, and your live
schedule for the next two weeks appears. It's read-only and nothing is stored
on a server — the access token lives only in your browser.

---

## Part 2 — Public "Availability" link

### 1. Publish your Outlook calendar

1. In **Outlook on the web**, go to **Settings** (gear) → **Calendar** →
   **Shared calendars**.
2. Under **Publish a calendar**, pick the calendar, set permissions to
   **"Can view when I'm busy"** (this keeps titles/details private), and click
   **Publish**.
3. Copy the **ICS** link (ends in `.ics`).

### 2. Configure the site

```
VITE_PUBLISHED_ICS_URL=https://outlook.office365.com/owa/calendar/.../calendar.ics
```

Open `/#/availability` (or use the **"View My Availability"** button in the
Contact section). Anyone with the link sees open slots during your business
hours and can email you a request for a time — no login required.

> If the ICS link can't be fetched (e.g. CORS), the page still renders all
> business hours as open and shows a warning. Outlook's published ICS endpoints
> generally allow cross-origin reads.

### 3. Tune the availability window (optional)

```
VITE_AVAILABILITY_DAYS=14     # days ahead to show
VITE_SLOT_MINUTES=30          # length of each slot
VITE_DAY_START_HOUR=9         # business hours start (24h, local time)
VITE_DAY_END_HOUR=18          # business hours end
VITE_WORKDAYS=1,2,3,4,5       # bookable days, 0=Sun … 6=Sat
VITE_LEAD_TIME_HOURS=2        # minimum notice before the first bookable slot
```

---

## Where to set the variables

### GitHub Pages (production)
Repo → **Settings** → **Secrets and variables** → **Actions** → **Variables**
tab → **New repository variable**. Add each `VITE_…` name/value. The deploy
workflow (`.github/workflows/pages.yml`) passes them to the build. Re-run the
**Deploy to GitHub Pages** workflow to apply changes.

### Local development
```bash
cp .env.example .env.local
# edit .env.local with your values
npm install
npm run dev
```

Then visit `http://localhost:5173/#/calendar` and `/#/availability`.

> The site builds and runs fine with no configuration — the calendar pages
> simply show a friendly "setup needed" notice until the variables are set.
