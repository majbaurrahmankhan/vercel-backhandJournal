

const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: { type: String, required: true },
  name: String,
  university: String,
  cell: String,
  designation: String,
  email: String,
  abstract: String,
  manuscriptFileId: mongoose.Schema.Types.ObjectId, // GridFS file _id
  manuscriptFileName: String,
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);