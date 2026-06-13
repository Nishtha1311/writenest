# Blog CMS — Full Stack MERN Application

A full-featured blog content management system built with MongoDB, Express, React, and Node.js.

## Features

- JWT authentication (register/login) with role-based access (admin, author, reader)
- Create, edit, delete, and publish blog posts (draft/published states)
- Rich post metadata: tags, categories, cover images, excerpts
- Image uploads for post cover images
- Full-text search and pagination
- Comments and like/unlike on posts
- View counters
- Author dashboard to manage own posts; admin can manage all
- Protected routes and role-based UI on the frontend

## Tech Stack

- **Frontend:** React 18, React Router, Axios, Vite
- **Backend:** Node.js, Express, JWT, bcrypt, Multer
- **Database:** MongoDB with Mongoose

## Project Structure

```
blog-cms/
├── backend/
│   ├── config/        # DB connection
│   ├── middleware/     # auth, error handling, file upload
│   ├── models/         # User, Post (Mongoose schemas)
│   ├── routes/         # auth, posts, users, upload
│   ├── uploads/         # uploaded images
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/         # axios instance
    │   ├── components/  # Navbar, PostCard, PrivateRoute
    │   ├── context/      # AuthContext
    │   ├── pages/        # Home, Login, Register, PostDetail, Dashboard, Editor
    │   └── App.jsx
    └── package.json
```

## Setup & Run

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # then edit MONGO_URI / JWT_SECRET as needed
npm run dev            # starts on http://localhost:5000
```

Requires a running MongoDB instance (local or Atlas).

### 2. Frontend

```bash
cd frontend
npm install
npm run dev            # starts on http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` requests to the backend.

## API Overview

| Method | Endpoint                  | Description                     | Auth          |
|--------|---------------------------|----------------------------------|---------------|
| POST   | /api/auth/register         | Register a new user              | Public        |
| POST   | /api/auth/login             | Login                             | Public        |
| GET    | /api/auth/me                | Get current user                  | Private       |
| GET    | /api/posts                  | List posts (search/pagination)   | Public        |
| GET    | /api/posts/:slug            | Get single post                   | Public        |
| POST   | /api/posts                  | Create post                       | Author/Admin  |
| PUT    | /api/posts/:id              | Update post                       | Author/Admin  |
| DELETE | /api/posts/:id              | Delete post                       | Author/Admin  |
| POST   | /api/posts/:id/comments      | Add comment                       | Private       |
| PUT    | /api/posts/:id/like           | Toggle like                       | Private       |
| POST   | /api/upload                  | Upload an image                   | Private       |
| GET    | /api/users                    | List all users                    | Admin         |
| PUT    | /api/users/:id/role           | Change user role                  | Admin         |
| PUT    | /api/users/profile             | Update own profile                | Private       |

## Notes for Resume

- Demonstrates full CRUD, authentication/authorization, role-based access control, file uploads, search/pagination, and a responsive React frontend.
- To deploy: host backend on Render/Railway, frontend on Vercel/Netlify, and database on MongoDB Atlas.
