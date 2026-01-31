# 🏨 The Wild Oasis - Hotel Management System

A comprehensive internal hotel management dashboard for **The Wild Oasis** boutique hotel. This application empowers hotel staff to efficiently manage cabins, bookings, guests, and daily operations.

## 🎯 Project Overview

**The Wild Oasis** is a complete hotel management solution consisting of two applications:
- **Admin Dashboard** (This project) - Internal management system for hotel staff
- **Customer Website** ([21-the-wild-oasis-website](https://github.com/hd-cmyk/21-the-wild-oasis-website)) - Public-facing booking platform for guests

## ✨ Features

### 📊 Dashboard
- **Real-time Statistics** - Track bookings, sales, check-ins, and occupancy rates
- **Interactive Charts** - Visualize sales trends and stay duration analytics
- **Activity Feed** - Monitor recent booking activities and guest check-ins

### 🏠 Cabin Management
- **CRUD Operations** - Create, read, update, and delete cabin listings
- **Photo Upload** - Manage cabin images via Supabase Storage
- **Pricing & Discounts** - Set regular prices and promotional discounts
- **Capacity Control** - Configure maximum guest capacity per cabin

### 📅 Booking Management
- **Booking Overview** - View all reservations with filtering and sorting
- **Status Tracking** - Monitor unconfirmed, checked-in, and checked-out bookings
- **Guest Information** - Access complete guest details and contact info
- **Payment Status** - Track paid and unpaid reservations

### ✅ Check-in / Check-out
- **Guest Check-in** - Process arrivals with payment confirmation
- **Add Breakfast** - Optional breakfast service during check-in
- **Quick Check-out** - Streamlined departure process
- **Status Updates** - Real-time booking status synchronization

### 👥 User Management
- **Staff Accounts** - Create and manage hotel employee accounts
- **Secure Authentication** - Email/password login with Supabase Auth
- **Profile Management** - Update personal info and avatars
- **Password Reset** - Secure password change functionality

### ⚙️ Settings
- **Booking Rules** - Configure min/max booking lengths and guest capacity
- **Pricing** - Set breakfast price per guest
- **Business Hours** - Manage operational parameters

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router v6
- **State Management:** React Query (TanStack Query)
- **Styling:** Styled Components
- **Backend:** Supabase (PostgreSQL + Authentication + Storage)
- **Forms:** React Hook Form
- **Charts:** Recharts
- **Date Handling:** date-fns
- **UI Notifications:** React Hot Toast
- **Error Handling:** React Error Boundary
- **Icons:** React Icons

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account and project
- Supabase database tables set up

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/hd-cmyk/17-the-wild-oasis.git
cd 17-the-wild-oasis
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

4. **Run development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── features/           # Feature-based modules
│   ├── authentication/ # Login and user management
│   ├── bookings/       # Booking operations
│   ├── cabins/         # Cabin management
│   ├── check-in-out/   # Check-in/out processes
│   ├── dashboard/      # Dashboard analytics
│   └── settings/       # App settings
├── pages/              # Page components
├── services/           # API services (Supabase)
├── ui/                 # Reusable UI components
├── hooks/              # Custom React hooks
├── context/            # Context providers
├── utils/              # Utility functions
├── styles/             # Global styles
└── data/               # Sample/seed data
```

## 🔑 Key Features Implementation

### Authentication
- Built with Supabase Auth
- Protected routes with authentication guards
- User session management

### Data Management
- React Query for server state management
- Optimistic updates for better UX
- Automatic cache invalidation
- Background data refetching

### UI/UX
- Fully responsive design
- Dark mode support (if implemented)
- Toast notifications for user feedback
- Loading states and error boundaries
- Confirmation modals for destructive actions

## 📊 Database Schema

The application uses Supabase with the following main tables:
- `cabins` - Cabin information and pricing
- `bookings` - Reservation records
- `guests` - Guest information
- `settings` - Application settings

## 🔗 Related Projects

- [The Wild Oasis Customer Website](https://github.com/hd-cmyk/21-the-wild-oasis-website) - Guest booking platform

## 🎓 Learning Outcomes

This project demonstrates:
- Advanced React patterns and best practices
- React Query for server state management
- Styled Components for CSS-in-JS
- Supabase integration (Database, Auth, Storage)
- Complex form handling with React Hook Form
- Data visualization with Recharts
- Modern React Router patterns
- Error handling and boundary implementation

## 📝 License

This project is for educational purposes.

## 👨‍💻 Author

[hd-cmyk](https://github.com/hd-cmyk)

## 🙏 Acknowledgments

Built as part of a React learning journey, implementing real-world hotel management functionality.
