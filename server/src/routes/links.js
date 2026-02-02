import express from 'express';
import Link from '../models/Link.js';
import { protect } from '../middleware/auth.js';
import { processLink } from '../services/aiService.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/links
// @desc    Get all links for current user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { group, search, sort = '-createdAt' } = req.query;

    // Build query
    const query = { user: req.user._id };
    
    if (group && group !== 'all') {
      query.group = group;
    }

    if (search) {
      query.$or = [
        { customName: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const links = await Link.find(query)
      .populate('group', 'name color icon')
      .sort(sort);

    res.json({ success: true, data: links });
  } catch (error) {
    console.error('Get links error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/links/search
// @desc    Search for links
// @access  Private
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Please provide a search query' });
    }

    // Text search using regex (more robust without requiring explicit text index)
    const links = await Link.find({
      user: req.user._id,
      $or: [
        { customName: { $regex: query, $options: 'i' } },
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    }).populate('group', 'name color icon');

    res.json({ success: true, data: links });
  } catch (error) {
    console.error('Search links error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/links
// @desc    Add new link with basic metadata and optional custom name
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { url, group, name } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, message: 'Please provide a URL' });
    }

    // Validate URL
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ success: false, message: 'Invalid URL format' });
    }

    // Create link with processing flag
    const link = await Link.create({
      url,
      customName: name || '',
      title: name || 'Processing...',
      user: req.user._id,
      group: group || null,
      isProcessing: true,
    });

    // Process link in background (fetch metadata)
    processLink(url)
      .then(async (metadata) => {
        link.title = metadata.title || metadata.domain;
        link.description = metadata.description;
        link.ogImage = metadata.ogImage;
        link.ogTitle = metadata.ogTitle;
        link.ogDescription = metadata.ogDescription;
        link.domain = metadata.domain;
        link.favicon = metadata.favicon;
        link.isProcessing = false;
        await link.save();
        console.log(`✅ Link processed: ${link.title}`);
      })
      .catch(async (error) => {
        console.error('Processing error:', error);
        link.title = new URL(url).hostname;
        link.isProcessing = false;
        link.processingError = error.message;
        await link.save();
      });

    // Return link immediately (will be updated in background)
    res.status(201).json({ success: true, data: link });
  } catch (error) {
    console.error('Create link error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/links/:id
// @desc    Update link
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ success: false, message: 'Link not found' });
    }

    // Check ownership
    if (link.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { title, name, description, group, aiTags } = req.body;

    if (title || name) {
      link.title = title || name || link.title;
    }
    
    if (name !== undefined) {
      link.customName = name;
    }
    link.description = description !== undefined ? description : link.description;
    link.group = group !== undefined ? group : link.group;
    
    if (aiTags) {
      link.aiTags = aiTags;
    }

    await link.save();

    const updatedLink = await Link.findById(link._id).populate('group', 'name color icon');

    res.json({ success: true, data: updatedLink });
  } catch (error) {
    console.error('Update link error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/links/:id
// @desc    Delete link
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ success: false, message: 'Link not found' });
    }

    // Check ownership
    if (link.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await link.deleteOne();

    res.json({ success: true, message: 'Link deleted' });
  } catch (error) {
    console.error('Delete link error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
