import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to Lifestyle Blender!</h1>
        <nav>
          <Link to="/register" className="nav-link">Register</Link>
          <Link to="/login" className="nav-link">Login</Link>
        </nav>
      </header>
      <main>
        <section className="home-intro">
          <h2>Explore our Blog</h2>
          <p>Discover amazing content created by our community. Share your own stories and connect with others.</p>
        </section>
      </main>
    </div>
  );
};

export default Home;
