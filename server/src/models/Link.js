import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Please provide a URL'],
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  // AI-generated fields
  aiSummary: {
    type: String,
    default: '',
  },
  aiTags: [{
    type: String,
    trim: true,
  }],
  // Vector embedding for semantic search (array of numbers)
  embedding: {
    type: [Number],
    default: [],
  },
  // Open Graph metadata
  ogImage: {
    type: String,
    default: '',
  },
  ogTitle: {
    type: String,
    default: '',
  },
  ogDescription: {
    type: String,
    default: '',
  },
  customName: {
    type: String,
    trim: true,
    default: '',
  },
  // User and group references
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    default: null,
  },
  // Metadata
  favicon: {
    type: String,
    default: '',
  },
  domain: {
    type: String,
    default: '',
  },
  isProcessing: {
    type: Boolean,
    default: false,
  },
  processingError: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt on save
linkSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for text search
linkSchema.index({ customName: 'text', title: 'text', description: 'text', aiSummary: 'text' });

// Index for vector search (will be created in MongoDB Atlas)
linkSchema.index({ embedding: '2dsphere' });

const Link = mongoose.model('Link', linkSchema);

export default Link;
