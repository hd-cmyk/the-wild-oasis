# 🏨 The Wild Oasis – Admin Dashboard

Internal hotel management dashboard for **The Wild Oasis** boutique hotel. Hotel staff can manage cabins, bookings, guests, and daily operations from this app.

**🚀 Live:** [https://the-wild-oasis-two-delta.vercel.app](https://the-wild-oasis-two-delta.vercel.app)

## 🎯 Overview

This repo is a monorepo. The **admin** app (this folder) is the staff dashboard; the **web** app is the guest-facing booking site.

- **Admin Dashboard** (this project) – Internal management for hotel staff  
- **Customer Website** ([../web](../web)) – Public booking platform for guests

## ✨ Features

### 📊 Dashboard

- **Real-time stats** – Bookings, sales, check-ins, occupancy
- **Charts** – Sales trends and stay duration
- **Activity feed** – Recent bookings and check-ins

### 🏠 Cabins

- **CRUD** – Create, read, update, delete cabin listings
- **Photos** – Cabin images via Supabase Storage
- **Pricing** – Regular price and discount
- **Capacity** – Max guests per cabin

### 📅 Bookings

- **Overview** – All reservations with filters and sort
- **Status** – Unconfirmed, checked-in, checked-out
- **Guests** – Details and contact info
- **Payments** – Paid vs unpaid

### ✅ Check-in / Check-out

- **Check-in** – Arrivals and payment confirmation
- **Breakfast** – Optional add-on at check-in
- **Check-out** – Quick departure flow
- **Status** – Booking status kept in sync

### 👥 Users

- **Staff accounts** – Create and manage employees
- **Auth** – Email/password with Supabase Auth
- **Profiles** – Update info and avatars
- **Password** – Reset and change

### ⚙️ Settings

- **Booking rules** – Min/max nights, capacity
- **Pricing** – Breakfast price per guest
- **Business** – Operational parameters

## 🛠️ Tech Stack

- **Framework:** React 18  
- **Build:** Vite  
- **Routing:** React Router v6  
- **Data:** TanStack Query (React Query)  
- **Styling:** Styled Components  
- **Backend:** Supabase (PostgreSQL, Auth, Storage)  
- **Forms:** React Hook Form  
- **Charts:** Recharts  
- **Dates:** date-fns  
- **Toasts:** React Hot Toast  
- **Errors:** React Error Boundary  
- **Icons:** React Icons  

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Supabase project with database tables set up

### Install and run

From the repo root:

```bash
cd admin
npm install
```

Add a `.env` in the `admin` folder:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

Then:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── features/
│   ├── authentication/
│   ├── bookings/
│   ├── cabins/
│   ├── check-in-out/
│   ├── dashboard/
│   └── settings/
├── pages/
├── services/
├── ui/
├── hooks/
├── context/
├── utils/
├── styles/
└── data/
```

## 📊 Database (Supabase)

Main tables: `cabins`, `bookings`, `guests`, `settings`.

## 🔗 Related

- [Customer website (web)](../web) – Guest booking platform  
- [Root README](../README.md) – Monorepo overview and live URLs  

## 📝 License

For educational use.
