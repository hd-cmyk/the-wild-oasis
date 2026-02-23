# 🏨 The Wild Oasis - Customer Booking Website

A customer-facing hotel booking platform for **The Wild Oasis**, a luxury boutique hotel. This project is the companion website to the [The Wild Oasis Admin Dashboard](https://github.com/hd-cmyk/the-wild-oasis), providing guests with a seamless booking experience.

**🚀 Live Demo:** [https://the-wild-oasis-website-one-liard.vercel.app](https://the-wild-oasis-website-one-liard.vercel.app)

## 🎯 Project Overview

**The Wild Oasis** ecosystem consists of two applications:

- **Admin Dashboard** ([the-wild-oasis](https://github.com/hd-cmyk/the-wild-oasis)) - Internal management system for hotel staff
- **Customer Website** (This project) - Public-facing booking platform for guests

## ✨ Features

- 🏠 **Browse Cabins** - View all available luxury cabins with detailed information and photos
- 📅 **Real-time Availability** - Check cabin availability with an interactive date picker
- 🔒 **Secure Authentication** - Google OAuth login via NextAuth.js
- 📝 **Reservation Management** - Create, view, update, and cancel bookings
- 👤 **Guest Profile** - Manage personal information and view booking history
- 💳 **Dynamic Pricing** - Automatic price calculation based on stay duration and discounts
- 📱 **Responsive Design** - Optimized for all devices

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** JavaScript
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js (Google Provider)
- **Database:** Supabase (PostgreSQL)
- **Date Handling:** date-fns, react-day-picker
- **Icons:** Heroicons
- **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project
- Google OAuth credentials

### Installation

1. Clone the repository

```bash
git clone https://github.com/hd-cmyk/the-wild-oasis-website.git
cd the-wild-oasis-website
```

2. Install dependencies

```bash
Set up environment variables
```

3. Create a .env.local file with:

```bash
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key   # Required for assistant (guest bookings, RAG)
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
AUTH_SECRET=your_nextauth_secret
```

4. Run development server
5. Open http://localhost:3000

📁 Project Structure

```bash
app/
├── _components/     # Reusable React components
├── _lib/           # Utilities, actions, and data services
├── cabins/         # Cabin listing and detail pages
├── account/        # User account and reservations
└── api/            # API routes for authentication
```

🔗 Related Projects
[The Wild Oasis Admin Dashboard](https://github.com/hd-cmyk/the-wild-oasis)- Hotel management system
📝 License
This project is for educational purposes.
