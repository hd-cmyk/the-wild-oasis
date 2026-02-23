# 🏨 The Wild Oasis – Customer Website

Guest-facing booking site for **The Wild Oasis**. Customers can browse cabins, check availability, and manage reservations.

**🚀 Live:** [https://the-wild-oasis-siiu.vercel.app/](https://the-wild-oasis-siiu.vercel.app/)

## 🎯 Overview

This repo is a monorepo. The **web** app (this folder) is the customer site; the **admin** app is the staff dashboard.

- **Customer Website** (this project) – Public booking for guests  
- **Admin Dashboard** ([../admin](../admin)) – Internal management for hotel staff  

## ✨ Features

- 🏠 **Browse cabins** – List and detail pages with photos and info  
- 📅 **Availability** – Interactive date picker for cabin availability  
- 🔒 **Auth** – Google OAuth via NextAuth.js  
- 📝 **Reservations** – Create, view, update, and cancel bookings  
- 👤 **Account** – Profile and booking history  
- 💳 **Pricing** – Calculated from stay length and discounts  
- 📱 **Responsive** – Works on all devices  

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)  
- **Language:** JavaScript  
- **Styling:** Tailwind CSS  
- **Auth:** NextAuth.js (Google)  
- **Database:** Supabase (PostgreSQL)  
- **Dates:** date-fns, react-day-picker  
- **Icons:** Heroicons  
- **Deploy:** Vercel  

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Supabase project
- Google OAuth client ID and secret (for NextAuth)

### Install and run

From the repo root:

```bash
cd web
npm install
```

Add a `.env.local` in the `web` folder:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
AUTH_SECRET=your_nextauth_secret
```

`SUPABASE_SERVICE_ROLE_KEY` is required for features such as the assistant and guest bookings.

Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
app/
├── _components/   # Reusable components
├── _lib/         # Utils, actions, data
├── cabins/       # Cabin list and detail
├── account/      # User account and reservations
└── api/          # Auth and other API routes
```

## 🔗 Related

- [Admin dashboard (admin)](../admin) – Hotel management  
- [Root README](../README.md) – Monorepo overview and live URLs  

## 📝 License

For educational use.
