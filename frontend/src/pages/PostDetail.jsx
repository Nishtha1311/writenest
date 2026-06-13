import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function PostDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${slug}`);
      setPost(res.data);
    } catch (err) {
      setError('Post not found');
    }
  };

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleLike = async () => {
    const res = await api.put(`/posts/${post._id}/like`);
    setPost((p) => ({ ...p, likes: Array(res.data.likes).fill(null) }));
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    await api.post(`/posts/${post._id}/comments`, { text: comment });
    setComment('');
    fetchPost();
  };

  if (error) return <p className="container error">{error}</p>;
  if (!post) return <p className="container">Loading...</p>;

  return (
    <div className="container">
      <h1>{post.title}</h1>
      <p className="meta">
        By {post.author?.name} · {new Date(post.createdAt).toLocaleDateString()} · {post.views} views
      </p>
      <div>
        {post.tags?.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} style={{ maxWidth: '100%', borderRadius: 8 }} />
      )}
      <div style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>{post.content}</div>

      {user && (
        <button className="btn secondary" onClick={handleLike} style={{ marginTop: '1rem' }}>
          ❤ {post.likes?.length || 0} Likes
        </button>
      )}

      <h3 style={{ marginTop: '2rem' }}>Comments ({post.comments?.length || 0})</h3>
      {post.comments?.map((c) => (
        <div className="card" key={c._id}>
          <strong>{c.user?.name || 'User'}</strong>
          <p>{c.text}</p>
        </div>
      ))}

      {user ? (
        <form onSubmit={handleComment}>
          <textarea
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ minHeight: 80 }}
          />
          <button className="btn" type="submit">
            Post Comment
          </button>
        </form>
      ) : (
        <p>
          <Link to="/login">Login</Link> to comment.
        </p>
      )}
    </div>
  );
}
