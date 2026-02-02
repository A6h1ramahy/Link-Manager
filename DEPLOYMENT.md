# 🚀 Deployment Guide: Link Saver

Since we've prepared the project for a **monolithic build** (where the backend serves the frontend), the deployment process is very straightforward.

## 1. Push Code to GitHub
If you haven't already, you need to put your code in a GitHub repository:
1. Create a new repository on [GitHub](https://github.com/new).
2. Run these commands in your project root:
   ```bash
   git init
   git add .
   git commit -m "Ready for deployment"
   git remote add origin YOUR_REPOSITORY_URL
   git branch -M main
   git push -u origin main
   ```

---

## 2. Deploy to Render (Recommended)
[Render](https://render.com) is the easiest platform for this setup.

### Step 1: Create a Web Service
1. Sign in to Render and click **"New"** → **"Web Service"**.
2. Connect your GitHub repository.

### Step 2: Configure Service Settings
- **Name**: `link-saver` (or whatever you like)
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### Step 3: Add Environment Variables
Click the **"Environment"** tab and add these keys:
- `MONGODB_URI`: (Your MongoDB Atlas connection string)
- `JWT_SECRET`: (A random string for security)
- `NODE_ENV`: `production`

---

## 3. Configure MongoDB Atlas
Most cloud hosts use dynamic IP addresses. To ensure your app can talk to the database:
1. Go to your **[MongoDB Atlas Dashboard](https://cloud.mongodb.com/)**.
2. Click **"Network Access"** in the sidebar.
3. Click **"Add IP Address"**.
4. Select **"Allow Access From Anywhere"** (IP `0.0.0.0/0`).
5. Click **"Confirm"**.

---

## 4. Verification
Once Render finishes the build (usually 1-3 minutes):
1. Render will give you a URL like `https://link-saver.onrender.com`.
2. Open that URL.
3. Your app should load, and you can register/login normally!

### Why this works?
Because of our recent changes, your backend now automatically detects it's in "production" and serves your beautiful React frontend from itself. No separate frontend hosting needed!
