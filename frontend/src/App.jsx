import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetail from './pages/PostDetail';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts/:slug" element={<PostDetail />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute roles={['admin', 'author']}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/editor/:id"
          element={
            <PrivateRoute roles={['admin', 'author']}>
              <Editor />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}
