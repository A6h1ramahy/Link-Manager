import express from 'express';
import Group from '../models/Group.js';
import Link from '../models/Link.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/groups
// @desc    Get all groups for current user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find({ user: req.user._id }).sort({ createdAt: -1 });

    // Get link counts for each group
    const groupsWithCounts = await Promise.all(
      groups.map(async (group) => {
        const linkCount = await Link.countDocuments({ group: group._id, user: req.user._id });
        return {
          ...group.toObject(),
          linkCount,
        };
      })
    );

    res.json({ success: true, data: groupsWithCounts });
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/groups
// @desc    Create new group
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Please provide a group name' });
    }

    const group = await Group.create({
      name,
      description: description || '',
      color: color || '#6366f1',
      icon: icon || '📁',
      user: req.user._id,
    });

    res.status(201).json({ success: true, data: group });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/groups/:id
// @desc    Update group
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Check ownership
    if (group.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { name, description, color, icon } = req.body;

    group.name = name || group.name;
    group.description = description !== undefined ? description : group.description;
    group.color = color || group.color;
    group.icon = icon || group.icon;

    await group.save();

    res.json({ success: true, data: group });
  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/groups/:id
// @desc    Delete group
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Check ownership
    if (group.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Remove group reference from all links in this group
    await Link.updateMany({ group: group._id }, { $unset: { group: 1 } });

    await group.deleteOne();

    res.json({ success: true, message: 'Group deleted' });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
