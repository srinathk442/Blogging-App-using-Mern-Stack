import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Welcome to our Website!</h1>
      <p>Explore our services and offerings.</p>
      <Link to="/signup">Sign Up</Link><br></br>
      <Link to="/login">Login</Link>
    </div>
  );
};

export default Home;
