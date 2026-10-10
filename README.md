# Matchet Marketplace

Matchet is a marketplace that connects buyers with product sellers and service providers. Users can explore products and services, manage their accounts, and use dedicated seller or provider workspaces.

## Project links

- **GitHub repository:** https://github.com/Daveralphy/matchet-marketplace
- **Staging website:** https://matchet-staging.vercel.app/
- **Staging API:** https://matchet-api-staging.vercel.app/

## Main features

- Account registration and email/password login
- Password reset by email using a single-use, expiring reset link
- Optional Google sign-in and account creation when OAuth credentials are configured
- Apple sign-in placeholder with a clear availability message until the full Apple flow is enabled
- Marketplace browsing for products and services
- Customer profile and account security settings
- Seller and service-provider onboarding and workspaces
- Product and service management, bookings, orders, and related account features

Feature availability depends on the configured environment variables and connected services. Do not commit real credentials or secrets to this repository.

## Technology

- **Frontend:** React, Vite, React Router, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Image storage:** Cloudinary
- **Password reset email:** Resend API
- **Social authentication:** Google OAuth 2.0; Apple sign-in is not enabled yet

## Requirements

Install Node.js 20 or newer and npm. A MongoDB database is required for the backend.

## Run locally

Open two terminals from the repository root.

### 1. Configure and start the backend

```bash
cd backend
npm install
cp .env.example .env
```

Update `backend/.env` with your local MongoDB connection string and a strong JWT secret:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

Start the API:

```bash
npm run dev
```

The health endpoint is available at http://localhost:5000/api/health.

### 2. Configure and start the frontend

In the second terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env` with:

```env
VITE_API_URL=http://localhost:5000
```

Start Vite:

```bash
npm run dev
```

Open the local URL printed by Vite, normally http://localhost:5173.

## Optional authentication and email configuration

Add these values to the **backend environment**, not the frontend environment, when enabling the corresponding features:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Sends password-reset emails through Resend |
| `EMAIL_FROM` | Verified sender address configured in Resend |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_REDIRECT_URI` | OAuth callback URL, for example `http://localhost:5000/api/auth/google/callback` |
| `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY`, `APPLE_REDIRECT_URI` | Reserved for future Apple sign-in setup |

For staging, set `CLIENT_URL` to `https://matchet-staging.vercel.app`, `BACKEND_URL` to `https://matchet-api-staging.vercel.app`, and register `https://matchet-api-staging.vercel.app/api/auth/google/callback` as an authorized redirect URI in Google Cloud Console. The Google and Resend credentials must be configured in the backend hosting environment before those features can be tested end to end.

Apple sign-in currently returns a user-facing message and does not authenticate users. Users can continue with Google or email/password.

## Build checks

Frontend production build:

```bash
cd frontend
npm run build
```

The backend currently has no automated test suite configured. Verify authentication, marketplace, seller, provider, order, and booking flows manually in a staging environment before presenting the application.

## Team

- Raphael Daveal Eferire
- Jorge Alberto Menjivar
- Brigham Young Iga
- Blake Wayne Ostler
