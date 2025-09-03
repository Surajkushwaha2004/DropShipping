# Dropship Backend


This is a minimal backend for the single-file dropshipping frontend I created. It provides:


- Static serving of the frontend (optional)
- Simple JSON-based persistent orders store (lowdb)
- REST endpoints to create/list orders
- Example Razorpay order creation endpoint (server-side) — you still need to call Razorpay from client and verify payments on server.


## Quick start
1. Create a folder `backend/` and save the files from this document as separate files: `package.json`, `server.js`, `.env.example`, etc.
2. `cd backend && npm install`
3. Copy `.env.example` to `.env` and fill in your keys (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
4. `npm run dev` (requires nodemon) or `npm start`
5. Backend runs on `http://localhost:4000` by default.


## Deployment
- Vercel/Heroku: push to git and follow host docs. Ensure your environment variables are set in the dashboard.
- For static frontend + backend on same host: build your frontend into `public/` and server serves it (see server.js static middleware).


Security note: keep API keys in environment variables. This repo is intentionally simple for learning and manual fulfillment.