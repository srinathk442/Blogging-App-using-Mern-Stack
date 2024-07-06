import React, { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserContext';
import './signup.css'; 
const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/login', { username, password }, { withCredentials: true });
      if (response.data.status === 'success') {
        setUserInfo(response.data.userInfo);
        setRedirect(true);
      } else {
        alert('Wrong credentials');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <div className="login-container">
      <div className="background-image"></div>
      <div className="login-form">
        <div className="title">
          <h1>Welcome to the Blog</h1>
        </div>
        <div className="signin">
          <h2>Sign in</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={handleUsername}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={handlePassword}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="checkbox"
                id="showPassword"
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPassword">Show password</label>
            </div>
            <button type="submit">Sign In</button>
            <div className="signup-link">
              <br />
              <a href="/signup">Don't have an account? Sign Up</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
