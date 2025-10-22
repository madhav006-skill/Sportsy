## Sportsy — Full‑stack Starter

Stack:
- Backend: Node.js + Express.js, MongoDB (Mongoose), Socket.io, Stripe/Razorpay
- Frontend: React (Vite) + Tailwind CSS + React Router + Axios + socket.io-client

### Prerequisites
- Node.js 18+ and npm 8+ (for npm workspaces)
- MongoDB Atlas connection string
- Optional: Stripe Secret Key, Razorpay Key ID/Secret

### Quick start (Windows PowerShell)
aman kk
1) Create `.env` files (manually) and fill values:
- `server/.env`
- `client/.env`

2) Install deps and run both apps:

```powershell
cd e:\Sportsy
npm install
npm run dev
```

Back-end on http://localhost:5000, front-end on http://localhost:5173.

### Env variables
- Server: create `server/.env` with your values
- Client: create `client/.env` with your values

### Scripts
- Root: `npm run dev` runs client and server concurrently.
- Server: `npm run dev` starts Express with nodemon.
- Client: `npm run dev` starts Vite dev server.

### Notes
- Basic chat via Socket.io is wired. Open two browser tabs on the Chat page to see real-time messages.
- Payments endpoints return a Stripe PaymentIntent client secret or a Razorpay order; integrate respective client SDKs next.
