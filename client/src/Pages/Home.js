import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { UserContext } from '../UserContext';

const Home = () => {
  const { userInfo } = useContext(UserContext);
  const username = userInfo?.username;

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to Lifestyle Blender!</h1>
        <nav>
          {!username && <Link to="/" className="nav-link">Home</Link>}
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
