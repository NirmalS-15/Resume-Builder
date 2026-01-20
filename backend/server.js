const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Serve frontend files (so requests like /frontend/editor.html work)
app.use(express.static(path.join(__dirname, '..')));

app.use("/api/auth", require("./routes/authRoutes"));
//app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
