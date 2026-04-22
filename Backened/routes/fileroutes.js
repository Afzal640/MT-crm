import express from "express";
import { upload } from "../middleware/uploadfile.js";
import File from "../MODELS/file.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 upload file
router.post("/upload/:leadId", protect, upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    const newFile = await File.create({
      leadId: req.params.leadId,
      name: file.originalname,
      url: `http://localhost:5000/uploads/${file.filename}`,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      uploadedBy: req.user?.name || "Admin"
    });

    res.json(newFile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 get files by lead
router.get("/:leadId", protect, async (req, res) => {
  try {
    const files = await File.find({ leadId: req.params.leadId });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    await File.findByIdAndDelete(req.params.id);
    res.json({ message: "File deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});










export default router;