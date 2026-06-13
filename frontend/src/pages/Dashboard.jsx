import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  const fetchMyPosts = async () => {
    const res = await api.get('/posts', { params: { status: 'draft', limit: 50 } });
    const published = await api.get('/posts', { params: { status: 'published', limit: 50 } });
    const all = [...res.data.posts, ...published.data.posts].filter(
      (p) => p.author?._id === user._id || user.role === 'admin'
    );
    setPosts(all);
  };

  useEffect(() => {
    fetchMyPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await api.delete(`/posts/${id}`);
    setPosts((p) => p.filter((post) => post._id !== id));
  };

  return (
    <div className="container">
      <h2>My Posts</h2>
      <Link to="/editor/new" className="btn">
        + New Post
      </Link>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div className="card" key={post._id}>
            <h3>{post.title}</h3>
            <p className="meta">
              Status: {post.status} · {post.views} views · {post.likes?.length || 0} likes
            </p>
            <Link to={`/editor/${post._id}`} className="btn secondary">
              Edit
            </Link>{' '}
            <button className="btn danger" onClick={() => handleDelete(post._id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
