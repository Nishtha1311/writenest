import React from 'react';
import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className="card">
      <h3>
        <Link to={`/posts/${post.slug}`}>{post.title}</Link>
      </h3>
      <p className="meta">
        By {post.author?.name || 'Unknown'} · {new Date(post.createdAt).toLocaleDateString()} ·{' '}
        {post.views} views · {post.likes?.length || 0} likes
      </p>
      <p>{post.excerpt || post.content.slice(0, 150) + '...'}</p>
      <div>
        {post.tags?.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
