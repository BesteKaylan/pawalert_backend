const express = require("express");
const cors = require("cors");
const app = express();
const reports = require("./_report");
const auth = require("./auth");
const db = require("./_db");

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/auth", auth);
app.use("/reports", reports);

// Root test endpoint
app.get("/", (req, res) => {
  res.send("PawAlert backend is running!");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// PORT for Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
