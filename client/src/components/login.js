import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../login.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LOGIN = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [captchaId, setCaptchaId] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = async () => {
    try {
      const response = await axios.get('http://localhost:3400/generate-captcha');
      setCaptcha(response.data.captcha);
      setCaptchaId(response.data.captchaId);
    } catch (err) {
      console.error('Error fetching CAPTCHA:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("http://localhost:3400/login", { username, password, captchaId, captchaValue });
      if (result.data.status === "success") {
        navigate('/landing');
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
              <div className="password-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handlePassword}
                  required
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </div>
            <div className="form-group captcha-container">
              <span>{captcha}</span>
              <input
                type="text"
                placeholder="Enter CAPTCHA"
                value={captchaValue}
                onChange={e => setCaptchaValue(e.target.value)}
                required
              />
            </div>
            <button type="submit">Sign In</button>
            <div className="signup-link">
              <a href="/signup">Don't have an account? Sign Up</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LOGIN;
