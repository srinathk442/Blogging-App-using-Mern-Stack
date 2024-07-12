import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import IndexPage from './Pages/IndexPage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import { UserContextProvider } from './UserContext';
import CreatePost from './Pages/CreatePost';
import PostPage from './Pages/PostPage';
import EditPost from './Pages/EditPost';
import SearchPage from './Pages/SearchPage';
import Home from './Pages/Home';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/index" element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/post" element={<CreatePost />} />
          <Route path="/logout" element={<IndexPage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/search" element={<SearchPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
