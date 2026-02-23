# 🏨 The Wild Oasis

**The Wild Oasis** is a full-stack boutique hotel management and booking system. It consists of a **dashboard** (for hotel staff) and a **customer website** (for guests). Both are deployed on Vercel.

---

## 🌐 Live URLs

| App | Description | URL |
|-----|-------------|-----|
| **Customer Website** | Guest-facing booking site | [https://the-wild-oasis-siiu.vercel.app/](https://the-wild-oasis-siiu.vercel.app/) |
| **Admin Dashboard** | Hotel staff management backend | [https://the-wild-oasis-two-delta.vercel.app](https://the-wild-oasis-two-delta.vercel.app) |

---

## 📦 Project Structure

This repo is a monorepo with two applications:

```
the-wild-oasis/
├── admin/          # Dashboard – hotel internal management (Vite + React)
├── web/            # Customer website – guest booking (Next.js)
└── README.md
```

### Dashboard `admin/`

- **Audience:** Hotel staff
- **Features:** Dashboard stats, cabin management, booking management, check-in/check-out, users & settings
- **Stack:** React 18, Vite, React Router, TanStack Query, Supabase, Styled Components, Recharts
- **Run locally:** `cd admin`, then `npm install` and `npm run dev` (default: `http://localhost:5173`)

### Customer Website `web/`

- **Audience:** Guests booking stays
- **Features:** Browse cabins, check availability, sign-in (e.g. Google OAuth), reservations & account
- **Stack:** Next.js 14 (App Router), NextAuth, Supabase, Tailwind CSS
- **Run locally:** `cd web`, then `npm install` and `npm run dev` (default: `http://localhost:3000`)

---

## 🚀 Local Development

### Prerequisites

- Node.js 18+
- A Supabase project (database, auth, storage, etc.)
- Environment variables for each app (see each sub-project’s README)

### Dashboard

```bash
cd admin
npm install
# Configure .env (e.g. VITE_SUPABASE_URL, VITE_SUPABASE_KEY)
npm run dev
```

### Customer Website

```bash
cd web
npm install
# Configure .env.local (e.g. SUPABASE_*, AUTH_*, etc.)
npm run dev
```

For detailed setup and scripts, see:

- [admin/README.md](./admin/README.md) — Dashboard
- [web/README.md](./web/README.md) — Customer website

---

## 🛠️ Tech Overview

| Area | Dashboard | Customer Website |
|------|-----------|------------------|
| Framework | React + Vite | Next.js 14 (App Router) |
| Routing | React Router v6 | Next.js built-in |
| State / Data | TanStack Query | Server Actions + Supabase |
| Styling | Styled Components | Tailwind CSS |
| Auth | Supabase Auth | NextAuth (e.g. Google) |
| Backend / Data | Supabase (PostgreSQL, etc.) | Supabase |
| Deployment | Vercel | Vercel |

---

## 📝 License & Notes

This project is for educational and demonstration purposes.

For more details on features, database design, and contribution, see the README files in each subdirectory.
