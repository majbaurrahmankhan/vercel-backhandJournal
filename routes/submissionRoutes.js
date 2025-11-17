// server/routes/submissionRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');

// Import Submission model
const Submission = require('../models/Submission');  // ✅ THIS IS IMPORTANT

// Your multer / GridFS storage code
const mongoURI = process.env.MONGO_URI || 'YOUR_MONGO_URI_HERE';
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => ({
    bucketName: 'uploads',
    filename: Date.now() + '' + file.originalname.replace(/\s+/g, '')
  })
});
const upload = multer({ storage });

// POST submission
router.post('/', upload.single('manuscriptFile'), async (req, res) => {
  try {
    const submission = new Submission({
      title: req.body.title,
      authors: req.body.authors,
      name: req.body.name,
      university: req.body.university,
      cell: req.body.cell,
      designation: req.body.designation,
      email: req.body.email,
      abstract: req.body.abstract,
      manuscriptFileId: req.file.id,
      manuscriptFileName: req.file.filename
    });

    await submission.save();
    res.status(201).json({ message: 'Submission successful', submission });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});


// GET all submissions
router.get("/", async (req, res) => {
  try {
    const submissions = await Submission.find();
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET PDF by GridFS id
router.get("/file/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid file ID");
    }
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
    bucket.openDownloadStream(fileId).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(404).send("File not found");
  }
});

// DELETE submission by ID (admin only)
router.delete("/:id", async (req, res) => {
  try {
    const submissionId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      return res.status(400).json({ error: "Invalid submission ID" });
    }

    const submission = await Submission.findById(submissionId);
    if (!submission) return res.status(404).json({ error: "Submission not found" });

    // Delete PDF from GridFS
    if (submission.manuscriptFileId) {
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
      await bucket.delete(submission.manuscriptFileId);
    }

    // Delete submission document
    await Submission.findByIdAndDelete(submissionId);

    res.json({ message: "Submission deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete submission" });
  }
});

module.exports = router;