const express = require("express");
const Resume = require("../models/Resume");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", auth, async (req, res) => {
    const resume = new Resume({
        userId: req.user.id,
        data: req.body.data,
        templateId: req.body.templateId
    });
    await resume.save();
    res.json({ message: "Resume Saved" });
});

router.get("/my", auth, async (req, res) => {
    const resumes = await Resume.find({ userId: req.user.id });
    res.json(resumes);
});

module.exports = router;
