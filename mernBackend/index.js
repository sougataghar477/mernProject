const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env

const app = express();

// CORS Configuration (Allows cookies from frontend)
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies)
  })
);

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB Session Store
const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret", // Use a strong secret
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true, // Prevents client-side JS access
      secure: false, // Set to `true` in production (HTTPS only)
      maxAge: 1000 * 60 * 60 * 24, // 1 day expiry
    },
  })
);

// Test Route to Set a Cookie
app.get("/set-cookie", (req, res) => {
  req.session.user = { username: "JohnDoe" };
  res.json("Session created and cookie set!");
});

// Test Route to Check Session
app.get("/get-session", (req, res) => {
  res.json(req.session.user || "No active session");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
