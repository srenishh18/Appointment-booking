# AppointEase - Modern Appointment Booking & Management System

**AppointEase** is a web-based appointment scheduling system featuring general Service Provider management, dedicated Provider & Admin Dashboards, real-time time slot conflict detection, accessible high-contrast UI design, and provider schedule filtering.

---

## 🔑 Demo Login Credentials

You can test all system roles using the following pre-configured demo accounts:

### 👤 Standard User Account
- **Email**: `user@example.com`
- **Password**: `password123`
- **Role**: Standard User (Book & manage appointments, view profile, real-time conflict warnings)

### 💼 Service Provider Account
- **Email**: `arun@provider.com`
- **Password**: `provider123`
- **Role**: Service Provider (Dr. Arun Kumar - View provider-specific schedule, accept/complete/cancel bookings, inspect slot conflict alerts)

### 🛡️ Admin Account
- **Email**: `admin@example.com`
- **Password**: `adminpassword`
- **Role**: System Administrator (View total user stats, filter appointments by provider, register/remove service providers, inspect system-wide time slot conflicts)

> **Note**: Clicking the **`👤 User`**, **`💼 Provider`**, or **`🛡️ Admin`** buttons on the [Login Page](login.html) will automatically fill the credentials for you!

---

## ✨ Features

- **🏠 Modern Landing Page**: Interactive hero section with quick scheduling previews and service highlights.
- **💼 Service Provider Roster**: Browse available consultants, counselors, medical specialists, legal advisors, and tech specialists.
- **📅 Appointment Scheduling**: Real-time date and time slot selection with automatic conflict detection warnings.
- **🛡️ Admin Control Center**: Filter appointments by individual provider, detect overlapping time slot conflicts, and register/remove service providers.
- **💼 Dedicated Provider Dashboard**: Separate provider login space allowing each provider to manage their own clients and track schedule conflicts.
- **🎨 Modern Design System**: Built with Google Font **Plus Jakarta Sans**, high-contrast color scheme, smooth CSS micro-interactions, and mobile responsiveness.

---

## 🚀 Quick Start (Running Locally)

1. Open `index.html` directly in any standard modern browser (Chrome, Firefox, Edge, Safari).
2. Alternatively, run a simple HTTP local server:
   ```bash
   python -m http.server 8080
   ```
3. Open `http://localhost:8080` in your web browser.

---

## 🛠️ Technology Stack

- **HTML5**: Semantic markup & accessibility structure.
- **CSS3**: Custom properties (`:root`), glassmorphism, flexbox/grid layout systems, and responsive media queries.
- **JavaScript (ES6+)**: Local storage state persistence (`localStorage`), dynamic role-based navbar routing, and real-time conflict detection algorithms.
- **Typography**: Google Font [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans).
