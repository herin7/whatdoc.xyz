const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  repoName: { type: String, required: true }, // e.g., "expressjs/express"
  slug: { type: String, required: true, unique: true }, // e.g., "my-cool-api"
  commitHash: { type: String, default: null }, // e.g., "7a8f9b..."
  subdomain: { type: String, unique: true, lowercase: true, sparse: true }, // e.g., "acme" → acme.whatdoc.xyz
  customDomain: { type: String, unique: true, lowercase: true, sparse: true }, // e.g., "docs.startup.com"
  techstack: { type: String, enum: ['MERN', 'Next.js', 'Other'], default: 'Other' },
  generatedDocs: { type: String, default: '' },
  isPublic: { type: Boolean, default: true },
  status: { type: String, enum: ['idle', 'queued', 'scanning', 'analyzing', 'generating', 'ready', 'failed'], default: 'idle' },
  llmProvider: { type: String, enum: ['gemini', 'openai'], default: 'gemini' },
  template: { type: String, enum: ['modern', 'minimal', 'twilio', 'django', 'mdn', 'aerolatex', 'fintech', 'devtools', 'minimalist', 'opensource', 'wiki', 'componentlib', 'consumertech', 'deepspace', 'web3', 'enterprise'], default: 'twilio' },
  isPremium: { type: Boolean, default: false },
  customization: {
    logoUrl: { type: String, default: '' },
    ownerName: { type: String, default: '' },
    currentVersion: { type: String, default: '1.0.0' },
    upcomingVersion: { type: String, default: '' },
    navLinks: [{
      label: { type: String },
      url: { type: String }
    }],
  },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);