const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    data: Object,
    templateId: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Resume", ResumeSchema);
