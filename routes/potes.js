// routes/posts.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Create post (with images)
router.post('/', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, price, country, category } = req.body;
    const images = (req.files || []).map(f => '/' + f.path.replace(/\\/g, '/'));
    const post = await Post.create({
      title, description, price: price || 0, images, country, category, owner: req.user.id
    });
    res.json(post);
  } catch (err) {
    console.error(err); res.status(500).json({ message: 'Server error' });
  }
});

// Get all posts (with pagination)
router.get('/', async (req, res) => {
  const { page = 1, limit = 12, q, country } = req.query;
  const filter = {};
  if(q) filter.title = new RegExp(q, 'i');
  if(country) filter.country = country;
  try{
    const posts = await Post.find(filter).sort({ createdAt: -1 }).skip((page-1)*limit).limit(Number(limit)).populate('owner', 'email name');
    res.json(posts);
  }catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// Get single
router.get('/:id', async (req, res) => {
  try{
    const post = await Post.findById(req.params.id).populate('owner', 'email name');
    if(!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  }catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// Update
router.put('/:id', authMiddleware, upload.array('images',5), async (req, res) => {
  try{
    const post = await Post.findById(req.params.id);
    if(!post) return res.status(404).json({ message: 'Not found' });
    if(post.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Not owner' });

    const { title, description, price, country, category } = req.body;
    if(title) post.title = title;
    if(description) post.description = description;
    if(price) post.price = price;
    if(country) post.country = country;
    if(category) post.category = category;
    if(req.files && req.files.length) {
      const images = req.files.map(f => '/' + f.path.replace(/\\/g, '/'));
      post.images = post.images.concat(images);
    }
    post.updatedAt = new Date();
    await post.save();
    res.json(post);
  }catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});

// Delete
router.delete('/:id', authMiddleware, async (req, res) => {
  try{
    const post = await Post.findById(req.params.id);
    if(!post) return res.status(404).json({ message: 'Not found' });
    if(post.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Not owner' });
    await post.remove();
    res.json({ message: 'Deleted' });
  }catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
