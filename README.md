# FundRising 🚀

A full-stack crowdfunding platform where Creators launch campaigns, Supporters contribute credits to back the ideas they care about, and Admins keep the platform trustworthy through campaign approvals, withdrawal processing, and report moderation.

**Live Site:** https://cf-client-8mxo.vercel.app  
**Client Repository:** https://github.com/Sadiqunnabi17/CF-client  
**Server Repository:** https://github.com/Sadiqunnabi17/CF-server

**Admin Credentials**
- Email: `sadique@gmail.com`
- Password: `Sad12345`

## Features

- 🔐 Full authentication system with email/password login, Google Sign-In, and a role-selection flow for new Google users (choose Supporter or Creator on first login)
- 💳 Real Stripe payment integration for purchasing credit packages (100 / 300 / 800 / 1500 credits)
- 🖼️ imgBB-powered image uploads for profile pictures and campaign cover images
- 📊 Three fully separate role-based dashboards — Supporter, Creator, and Admin — each with their own stats, navigation, and permissions enforced by JWT + role middleware on the server
- 💰 Complete contribution lifecycle: Supporters contribute credits, Creators approve or reject each contribution, with automatic credit refunds on rejection
- 🏦 Creator withdrawal system with real business logic (20 credits = $1, 200-credit minimum withdrawal) and Admin-side payment processing
- 🛡️ Admin moderation tools: campaign approval/rejection, user role management, campaign deletion, and a full reporting system with campaign suspension
- 🔔 Live notification system with an unread-count badge, floating popup, and click-to-navigate — fires automatically on contribution approval/rejection, campaign approval/rejection, and new contributions
- 📄 Paginated "My Contributions" history for Supporters
- 📱 Fully responsive design across mobile, tablet, and desktop — including a dedicated mobile navigation menu
- 🔄 Persistent login across page refreshes using JWT verification against the server, not just cached local state
- 🎠 Animated homepage with a Swiper-powered hero carousel, top-funded campaigns, testimonials, and category browsing

## Tech Stack

**Frontend:** Next.js (App Router), Tailwind CSS, Swiper, Framer Motion, Stripe.js  
**Backend:** Express, MongoDB (Mongoose), Passport (Google OAuth), JWT, Stripe  
**Deployment:** Vercel (client), Render (server), MongoDB Atlas

## Getting Started (Local Development)

### Server
```bash
cd server
npm install
# create a .env file with MONGODB_URI, JWT_SECRET, CLIENT_URL, SERVER_URL,
# GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, STRIPE_SECRET_KEY
npm run dev
```

### Client
```bash
cd client
npm install
# create a .env.local file with NEXT_PUBLIC_API_URL,
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, NEXT_PUBLIC_IMGBB_API_KEY
npm run dev
```

## Roles at a Glance

| Role | Starting Credits | Core Capabilities |
|---|---|---|
| Supporter | 50 | Browse & contribute to campaigns, purchase credits, track contribution history, report campaigns |
| Creator | 20 | Launch campaigns, review contributions, request withdrawals, manage own campaigns |
| Admin | — | Approve/reject campaigns, process withdrawals, manage users, moderate reports |