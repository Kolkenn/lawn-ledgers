# 🌿 LawnLedgers

> An all-in-one SaaS platform for small to medium-sized landscaping businesses — manage clients, schedule jobs, send invoices, and get paid faster.

Built as a solo full-stack project to solve a real problem: most landscaping companies are run by skilled tradespeople who shouldn't have to juggle spreadsheets, paper invoices, and disconnected tools just to run their business.

## 🌐 Live Demo

[Marketing Site](https://kolkenn.github.io/lawn-ledgers/) — 
static landing page deployed via GitHub Pages

---

## 📐 Architecture

This is a monorepo containing three independently deployable components:

```
lawn-ledgers/
├── backend/          # Python / FastAPI REST API
├── webapp/           # React / TypeScript frontend (the app)
└── marketing-site/   # Static HTML marketing landing page
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Python + FastAPI | REST API and webhook handling |
| Firebase Admin SDK + Firestore | Database and server-side auth |
| Stripe Subscriptions API | Billing and plan management |
| Stripe Connect API | Contractor payment processing |
| python-dotenv | Environment configuration |

### Frontend (webapp)
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tooling |
| React Router v6 | Client-side routing and route protection |
| DaisyUI + Tailwind CSS | Component library and styling |
| react-i18next | Internationalization (EN/ES) |
| Firebase Auth | Authentication (email + SSO) |

### Marketing Site
| Technology | Purpose |
|---|---|
| HTML + Tailwind CSS (CDN) | Static landing page |
| DaisyUI | Component styling and theming |
| Lucide Icons | Iconography |

---

## ✅ Features Implemented

### Authentication & Onboarding
- Email/password and SSO (Google) authentication via Firebase
- Multi-step company creation flow (name → address → subscription → payment setup)
- Route guards that enforce onboarding completion before app access
- Subscription gating — users without an active plan are blocked with a clear prompt

### Billing (Stripe Subscriptions)
- Stripe Checkout integration for new subscriptions with optional 14-day trial
- Stripe Customer Portal for self-serve plan management and cancellations
- Secure webhook endpoint for real-time subscription lifecycle events (`customer.subscription.*`)
- Firestore automatically updated on every subscription state change

### Payments (Stripe Connect)
- Stripe Connect onboarding flow for contractors to accept client payments
- Account creation with optional pre-filling from company profile data
- Webhook handling for `account.updated` to track onboarding completion status
- Charges and payouts status reflected in real time via Firestore

### App
- Protected dashboard and settings pages
- Company profile management (name, address, logo upload)
- Team management with role-based access (Owner / Crew)
- Full light/dark theme support (emerald / forest)
- Complete English and Spanish translations via i18n

### Marketing Site
- Responsive landing page with features, pricing, and add-on sections
- Auto-hiding header on mobile scroll
- Light/dark theme toggle with localStorage persistence

---

## 🚧 Planned / In Progress

- [ ] Client CRM — contact management, property details, service history
- [ ] Job scheduling — calendar view, job assignment to crew members
- [ ] Invoice generation — PDF invoices with online payment links
- [ ] Route optimization — efficient scheduling for multi-stop service days
- [ ] Mobile app (React Native) — field-facing crew interface

---

## 🚀 Running Locally

### Backend
cd backend

# Create and activate virtual environment
uv venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
uv sync

# Start the development server
uvicorn main:app --reload

### Frontend (webapp)

```bash
cd webapp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your Firebase config and backend URL

# Start the development server
npm run dev
```

### Marketing Site

```bash
cd marketing-site
# Open index.html directly in a browser — no build step required
```

---

## 🔐 Environment Variables

### Backend `.env`
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLIENT_BASE_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
```

### Frontend `.env`
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_BACKEND_URL=http://localhost:8000
```

> **Note:** A `serviceAccountKey.json` Firebase service account file is required for the backend. Download it from your Firebase project console. This file is gitignored and should never be committed.

---

## 📌 Status

Active side project — core billing, authentication, and payment infrastructure are complete. CRM, scheduling, and invoicing features are in active development.

---

## 🧑‍💻 Author

**Leonel Ponce** — [LinkedIn](https://www.linkedin.com/in/ponceleonel) · [GitHub](https://github.com/Kolkenn)

> Built from scratch because real problems deserve real solutions.

© 2025 Leonel Ponce. All rights reserved. This repository is publicly visible for portfolio purposes only.
