# Deployment Guide: Sri Krishna Yadav Youth Guraja (SKY)

This guide provides instructions for deploying the **Sri Krishna Yadav Youth Guraja Platform** to production across various popular hosting providers.

---

## 🏗️ Architecture Overview

The system consists of:
1. **Public Website Frontend** (`public-website/`): Can be deployed to **Vercel**, **Netlify**, **Cloudflare Pages**, or served by the backend.
2. **Internal Committee Mobile/Web App** (`client/`): Optimized React 19 PWA interface.
3. **Verified Ledger Backend API** (`server/`): Node.js + Express + SQLite WebAssembly database with synchronous ACID persistence to `server/data/sky_guraja.sqlite`.

---

## 🚀 Option 1: Vercel (Recommended for Public Website)

1. Push the repository to GitHub / GitLab.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Select the repository and set:
   - **Root Directory**: `public-website`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy. The `vercel.json` file handles all client-side routing.

---

## 🚀 Option 2: Render / Railway / DigitalOcean App Platform (For Backend API)

1. Connect your repository to [Render](https://render.com) or [Railway](https://railway.app).
2. Set:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV=production`
     - `PORT=5000`
     - `JWT_SECRET=your_strong_secret_key`
     - `CORS_ORIGIN=*`
3. Add a **Persistent Disk** mounted at `/app/server/data` to ensure SQLite database persistence across restarts.

---

## 🚀 Option 3: Unified Single-Server VPS Deployment (Ubuntu / Nginx / PM2 / Docker)

Using Docker on any Ubuntu/Debian VPS (AWS EC2, DigitalOcean Droplet, Linode, Hetzner):

```bash
# Clone the repository
git clone https://github.com/your-org/sky-guraja-app.git
cd sky-guraja-app

# Build and run the production Docker container
docker build -t sky-guraja-app .
docker run -d -p 5000:5000 -v $(pwd)/server/data:/app/server/data --name sky_app sky-guraja-app
```

---

## 📋 Pre-Launch Production Checklist

- [x] Strict mathematical double-entry balance verification active
- [x] Digital receipt sequential counter (`SKY-REC-YYYY-XXXX`) and SHA256 security hashing
- [x] Multi-tier approval thresholds tested (<₹5k, ₹5k-₹25k, >₹25k)
- [x] Auditor role mutation guard active
- [x] Privacy compliance: "Display my name publicly" defaults to OFF
- [x] 16 Authentic temple, festival, and youth rally photos integrated with interactive slideshow
- [x] OpenGraph, Twitter Cards, and Schema.org NGO structured data configured
- [x] All 5 Vitest automated test suites passing
