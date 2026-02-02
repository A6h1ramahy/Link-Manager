# Link Saver - Smart Link Management

A beautiful, organized link saver with automatic metadata extraction, search, and visual knowledge graphs. Built with the MERN stack (MongoDB, Express, React, Node.js).

## ✨ Features

### 📊 Organization
- **Custom Collections**: Organize links by subject/topic with custom colors and icons
- **Knowledge Graph**: Visualize connections between your links based on collections
- **Rich Previews**: Beautiful Open Graph image previews

### 🔍 Smart Features
- **Auto-Metadata**: Automatically extracts title, description, and images from links
- **Text Search**: Search across titles and descriptions
- **Group Filtering**: Filter links by collection

### 🎨 Premium Design
- **Glassmorphism UI**: Modern, beautiful interface with smooth animations
- **Dark/Light Themes**: Switch between themes with full persistence
- **Responsive Design**: Mobile-first design with a smart sidebar toggle for seamless mobile usage

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   cd link_save
   ```

2. **Set up environment variables**

   Create `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

   Create `client/.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Install dependencies**

   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

4. **Run the application**

   ```bash
   # Terminal 1 - Start backend server
   cd server
   npm run dev

   # Terminal 2 - Start frontend dev server
   cd client
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📝 How to Get MongoDB Atlas

### MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string and replace `<password>` with your database password
6. Add `/link_saver` before the `?` in the URI
7. Paste it into your `.env` file as `MONGODB_URI`

**Important**: Go to Network Access and add your IP address (or use `0.0.0.0/0` for development)

## 🛠️ Tech Stack

### Backend
- **Node.js & Express**: RESTful API server
- **MongoDB & Mongoose**: Database and ODM
- **JWT**: Authentication
- **Axios & Cheerio**: Web scraping for link metadata

### Frontend
- **React 19**: UI framework
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **D3.js**: Interactive knowledge graph visualization
- **Axios**: HTTP client

## 📱 Usage

1. **Register/Login**: Create an account or sign in
2. **Add Links**: Click "Add Link" and paste any URL
3. **Auto-Processing**: Watch as the app automatically:
   - Extracts the title
   - Gets the description
   - Fetches preview images
4. **Organize**: Create collections and assign links to them
5. **Search**: Use search to find links by title or description
6. **Visualize**: Switch to graph view to see link connections by collection

## 🎯 Key Features

- **Auto-Metadata**: Automatically extracts Open Graph data
- **Text Search**: Find links across titles and descriptions
- **Knowledge Graph**: See how your links connect through collections
- **Subject Collections**: Group links by topics
- **Dark/Light Themes**: Beautiful in any lighting

## 🔒 Security

- Passwords hashed with bcrypt
- JWT token authentication
- Protected API routes
- CORS configured for security

## 📄 License

MIT License - feel free to use this project however you like!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using MERN stack
