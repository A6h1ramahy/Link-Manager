import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a group name'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '#6366f1', // Default indigo color
  },
  icon: {
    type: String,
    default: '📁', // Default folder emoji
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
groupSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for link count (will be populated separately)
groupSchema.virtual('linkCount', {
  ref: 'Link',
  localField: '_id',
  foreignField: 'group',
  count: true,
});

const Group = mongoose.model('Group', groupSchema);

export default Group;
