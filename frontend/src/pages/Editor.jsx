import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [form, setForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    tags: '',
    category: 'general',
    status: 'draft',
  });
  const [postId, setPostId] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isNew) {
      api.get(`/posts/by-id/${id}`).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch existing post for edit (by slug lookup not available by id directly, so try dashboard list)
  useEffect(() => {
    if (!isNew) {
      api.get('/posts', { params: { limit: 100, status: 'draft' } }).then(async (res) => {
        let found = res.data.posts.find((p) => p._id === id);
        if (!found) {
          const pub = await api.get('/posts', { params: { limit: 100 } });
          found = pub.data.posts.find((p) => p._id === id);
        }
        if (found) {
          setForm({
            title: found.title,
            content: found.content,
            excerpt: found.excerpt,
            coverImage: found.coverImage,
            tags: (found.tags || []).join(', '),
            category: found.category,
            status: found.status,
          });
          setPostId(found._id);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append('image', file);
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((f) => ({ ...f, coverImage: res.data.url }));
    } catch (err) {
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (isNew) {
        await api.post('/posts', payload);
      } else {
        await api.put(`/posts/${postId || id}`, payload);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post');
    }
  };

  return (
    <div className="container">
      <h2>{isNew ? 'New Post' : 'Edit Post'}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input
          name="excerpt"
          placeholder="Short excerpt (optional)"
          value={form.excerpt}
          onChange={handleChange}
        />
        <textarea
          name="content"
          placeholder="Write your post content here..."
          value={form.content}
          onChange={handleChange}
          required
        />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input
          name="tags"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={handleChange}
        />
        <label>Cover Image</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {uploading && <p>Uploading...</p>}
        {form.coverImage && (
          <img src={form.coverImage} alt="cover" style={{ maxWidth: 200, display: 'block', marginBottom: '0.75rem' }} />
        )}
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <button className="btn" type="submit">
          Save Post
        </button>
      </form>
    </div>
  );
}
