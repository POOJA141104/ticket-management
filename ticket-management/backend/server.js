const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Auth: ${req.headers.authorization ? 'Bearer' : 'None'}`);
  next();
});

// Routes
app.use("/api/auth",        require("./routes/authRoutes"));
app.use("/api/departments", require("./routes/departmentRoutes"));
app.use("/api/programmes",  require("./routes/programmeRoutes"));
app.use("/api/blocks",      require("./routes/blockRoutes"));
app.use("/api/rooms",       require("./routes/roomRoutes"));
app.use("/api/roles",       require("./routes/roleRoutes"));
app.use("/api/users",       require("./routes/userRoutes"));
app.use("/api/complaints",  require("./routes/complaintRoutes"));
app.use("/api/reports",     require("./routes/reportRoutes"));

// Health check
app.get("/api/health", (req, res) => res.json({ status: "OK", message: "Ticket Management API running" }));

// Serve frontend build if available
const path = require("path");
const fs = require("fs");
const buildPath = path.join(__dirname, "../frontend-web/build");
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  app.get("*", (req, res, next) => {
    if (req.url.startsWith("/api") || req.url.startsWith("/uploads")) return next();
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || "Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
