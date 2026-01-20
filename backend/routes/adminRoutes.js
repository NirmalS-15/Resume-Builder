const express = require("express");
const User = require("../models/User");
const Resume = require("../models/Resume");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/stats", auth, async (req, res) => {
    const users = await User.countDocuments();
    const resumes = await Resume.countDocuments();
    res.json({ users, resumes });
});

router.get("/users", auth, async (req, res) => {
    const users = await User.find().select("-password");
    res.json(users);
});

module.exports = router;
