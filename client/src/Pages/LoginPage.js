import React, { useState, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import "../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faSyncAlt } from "@fortawesome/free-solid-svg-icons";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaId, setCaptchaId] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    fetchCaptcha();
  }, []);

  async function fetchCaptcha() {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/generate-captcha`);
      if (!response.ok) {
        throw new Error("Failed to fetch CAPTCHA");
      }
      const data = await response.json();
      setCaptcha(data.captcha);
      setCaptchaId(data.captchaId);
      setFetchError(null);
    } catch (error) {
      console.error("Error fetching CAPTCHA:", error);
      setFetchError("Failed to fetch CAPTCHA. Please try again later.");
    }
  }

  async function login(ev) {
    ev.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/login`, {
        method: "POST",
        body: JSON.stringify({ username, password, captchaId, captchaValue }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const userInfo = await response.json();
        setUserInfo(userInfo); // Assuming this updates your user context
        setRedirect(true); // Redirect to /index after successful login
      } else {
        alert("Wrong credentials or CAPTCHA");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to login. Please try again later.");
    }
  }

  if (redirect) {
    return <Navigate to="/index" />;
  }

  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
        autoComplete="off"
      />
      <div className="password-container">
        <label htmlFor="password">Password</label>
        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            autoComplete="new-password"
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>
      </div>
      <div className="captcha-container">
        <label htmlFor="captcha">CAPTCHA:</label>
        <div className="captcha-box">
          <span className="captcha-text">{captcha}</span>
          <button
            type="button"
            className="refresh-captcha"
            onClick={fetchCaptcha}
            id="button-addon2"
          >
            <FontAwesomeIcon icon={faSyncAlt} aria-hidden="true" />
          </button>
        </div>
        <input
          type="text"
          id="captcha"
          placeholder="Enter CAPTCHA"
          value={captchaValue}
          onChange={(ev) => setCaptchaValue(ev.target.value)}
        />
      </div>
      <button type="submit">Login</button>
      {fetchError && <p className="error-message">{fetchError}</p>}
    </form>
  );
}
