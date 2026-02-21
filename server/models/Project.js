const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  repoName: { type: String, required: true }, // e.g., "expressjs/express"
  slug: { type: String, required: true, unique: true }, // e.g., "my-cool-api"
  techstack: { type: String, enum: ['MERN', 'Next.js', 'Other'], default: 'Other' },
  generatedDocs: { type: String, default: '' },
  isPublic: { type: Boolean, default: true },
  status: { type: String, enum: ['idle', 'scanning', 'generating', 'ready', 'failed'], default: 'idle' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);