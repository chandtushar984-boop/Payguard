
# Payguard
=======
# PayGuard — Bank Fraud Detection System

## Setup (3 steps)

```bash
cd payguard
npm install
npm run dev
```

Open http://localhost:5173

## Login
- **Admin:** admin / admin123 (can add transactions, manage blacklist, change statuses)
- **Viewer:** viewer / view123 (read-only)

## Features
- Location + notification permissions on login
- Rule-based fraud engine (no paid API — 100% free)
- Real-time risk score preview while adding transactions
- Block/flag/clear transactions manually
- Blacklist management
- Charts: doughnut breakdown + bar chart of top fraud triggers
- Redux Toolkit state management
- React Router with protected routes
- Role-based access (admin vs viewer)
- Debounced search + filter
- Browser notifications when payment is blocked

## Free APIs Used
- **Nominatim (OpenStreetMap)** — reverse geocoding from GPS (completely free, no key needed)
- **Browser Geolocation API** — get user coordinates
- **Browser Notifications API** — push alerts for blocked transactions

## Fraud Rules
| Rule | Points |
|------|--------|
| Amount > ₹1,00,000 | +40 |
| Amount > ₹50,000 | +20 |
| Blacklisted account | +50 |
| Foreign location | +25 |
| Off-hours (11pm–6am) | +15 |
| New account + large amount | +20 |
| Suspicious round amount | +10 |

Score ≥70 = Blocked · ≥40 = Flagged · <40 = Cleared

## Tech Stack
- React 18 + Vite
- Redux Toolkit
- React Router v6
- Chart.js + react-chartjs-2
- No CSS frameworks (pure inline styles)

