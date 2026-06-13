
# WriteNest

A full-stack **Multi-Author Blogging Platform** built using the MERN Stack. WriteNest enables users to create, publish, and manage blog content through a secure role-based system supporting Admins, Authors, and Readers.

## 🚀 Features

### Authentication & Authorization

* JWT-based Authentication
* Secure Password Hashing with bcrypt
* Role-Based Access Control (Admin, Author, Reader)
* Protected Routes

### Blog Management

* Create, Edit, Delete, and Publish Blog Posts
* Draft & Published Post States
* Rich Post Metadata (Categories, Tags, Excerpts)
* Cover Image Upload Support
* Author Dashboard for Managing Posts

### User Engagement

* Comment System
* Like / Unlike Posts
* View Counters
* Author Profiles

### Search & Discovery

* Full-Text Search
* Category-Based Filtering
* Pagination
* Recent Posts Feed

### Admin Controls

* Manage All Posts
* Manage Users and Roles
* Content Moderation

---

## 🛠 Tech Stack

### Frontend

* React.js
* React Router
* Axios
* Vite
* CSS

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt.js
* Multer

### Database

* MongoDB
* Mongoose

---

## 📂 Project Structure

```text
writenest/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── App.jsx
    │
    └── package.json
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Nishtha1311/writenest.git
cd writenest
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start Backend Server:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

Backend runs on:

```text
http://localhost:5000
```

---

## 📡 API Endpoints

| Method | Endpoint                | Description     | Access       |
| ------ | ----------------------- | --------------- | ------------ |
| POST   | /api/auth/register      | Register User   | Public       |
| POST   | /api/auth/login         | Login User      | Public       |
| GET    | /api/auth/me            | Current User    | Private      |
| GET    | /api/posts              | Get All Posts   | Public       |
| GET    | /api/posts/:slug        | Get Single Post | Public       |
| POST   | /api/posts              | Create Post     | Author/Admin |
| PUT    | /api/posts/:id          | Update Post     | Author/Admin |
| DELETE | /api/posts/:id          | Delete Post     | Author/Admin |
| POST   | /api/posts/:id/comments | Add Comment     | Private      |
| PUT    | /api/posts/:id/like     | Toggle Like     | Private      |
| POST   | /api/upload             | Upload Image    | Private      |
| GET    | /api/users              | Get Users       | Admin        |
| PUT    | /api/users/:id/role     | Change Role     | Admin        |
| PUT    | /api/users/profile      | Update Profile  | Private      |

---

## 🎯 Learning Outcomes

This project demonstrates:

* Full-Stack MERN Development
* REST API Design
* Authentication & Authorization
* Role-Based Access Control (RBAC)
* MongoDB Data Modeling
* CRUD Operations
* Search & Pagination
* File Upload Handling
* Frontend-Backend Integration

---

## 👩‍💻 Author

**Nishtha Vatsa**

GitHub: https://github.com/Nishtha1311

---


