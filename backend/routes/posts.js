const express = require('express');
const Post = require('../models/Post');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

// @route GET /api/posts  (list, with search/pagination/filter)
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, category, tag, status = 'published' } = req.query;

    const query = { status };
    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (tag) query.tags = tag;

    const posts = await Post.find(query)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Post.countDocuments(query);

    res.json({ posts, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

// @route GET /api/posts/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.views += 1;
    await post.save();

    res.json(post);
  } catch (err) {
    next(err);
  }
});

// @route POST /api/posts
router.post('/', protect, authorize('admin', 'author'), async (req, res, next) => {
  try {
    const { title, content, excerpt, coverImage, tags, category, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    let slug = slugify(title);
    const slugExists = await Post.findOne({ slug });
    if (slugExists) slug = `${slug}-${Date.now()}`;

    const post = await Post.create({
      title,
      slug,
      content,
      excerpt,
      coverImage,
      tags,
      category,
      status,
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
});

// @route PUT /api/posts/:id
router.put('/:id', protect, authorize('admin', 'author'), async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    const fields = ['title', 'content', 'excerpt', 'coverImage', 'tags', 'category', 'status'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) post[f] = req.body[f];
    });

    await post.save();
    res.json(post);
  } catch (err) {
    next(err);
  }
});

// @route DELETE /api/posts/:id
router.delete('/:id', protect, authorize('admin', 'author'), async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
});

// @route POST /api/posts/:id/comments
router.post('/:id/comments', protect, async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ user: req.user._id, text });
    await post.save();

    res.status(201).json(post.comments);
  } catch (err) {
    next(err);
  }
});

// @route PUT /api/posts/:id/like
router.put('/:id/like', protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const idx = post.likes.findIndex((id) => id.toString() === req.user._id.toString());
    if (idx === -1) post.likes.push(req.user._id);
    else post.likes.splice(idx, 1);

    await post.save();
    res.json({ likes: post.likes.length });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
