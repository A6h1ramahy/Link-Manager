# Quick Start Guide

## Starting the Application

### 1. Start Backend Server
```bash
cd server
npm run dev
```

**Expected output:**
```
✅ MongoDB Connected: your-cluster.mongodb.net
🚀 Server running on port 5000
📡 API available at http://localhost:5000/api
```

### 2. Start Frontend (New Terminal)
```bash
cd client
npm run dev
```

**Expected output:**
```
VITE v7.3.1  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### 3. Open Browser
Navigate to: **http://localhost:5173**

---

## Troubleshooting

### Backend won't start?
1. Check MongoDB URI in `.env` has correct password
2. Make sure port 5000 is not in use
3. Check terminal for error messages

### Frontend can't connect to backend?
1. Make sure backend is running first
2. Check that backend shows "Server running on port 5000"
3. Verify `client/.env` has `VITE_API_URL=http://localhost:5000/api`

### MongoDB connection fails?
1. Go to MongoDB Atlas → Network Access
2. Add your IP address or use `0.0.0.0/0` (allow from anywhere)
3. Restart the backend server
4. Make sure database name `link_saver` is in the URI

---

## Current Configuration

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173
- **Database**: MongoDB Atlas (link_saver database)
- **Features**: Auto-metadata extraction, collections, search, knowledge graph
