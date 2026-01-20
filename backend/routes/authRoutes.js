const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const SECRET = "resume_secret_key";

// USER REGISTER
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Registration failed" });
    }
});

// USER LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, SECRET);
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Login failed" });
    }
});

// ADMIN LOGIN
router.post("/admin", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "admin123") {
        const token = jwt.sign({ role: "admin" }, SECRET);
        return res.json({ token });
    }
    res.status(401).json({ message: "Unauthorized" });
});

module.exports = router;
