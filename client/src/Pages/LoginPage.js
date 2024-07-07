import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import '../App.css'; // Import the main CSS file

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaId, setCaptchaId] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchCaptcha();
  }, []);

  async function fetchCaptcha() {
    const response = await fetch('http://localhost:4000/generate-captcha');
    const data = await response.json();
    setCaptcha(data.captcha);
    setCaptchaId(data.captchaId);
  }

  async function login(ev) {
    ev.preventDefault();
    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, captchaId, captchaValue }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (response.ok) {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      alert('Wrong credentials or CAPTCHA');
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }

  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={ev => setUsername(ev.target.value)}
        autoComplete="off"
      />
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={password}
        onChange={ev => setPassword(ev.target.value)}
        autoComplete="new-password"
      />
      <br />
      <label>
        <center>Show Password</center>
        <input
          type="checkbox"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
        />
      </label>
      <div className="captcha-container">
        <span>{captcha}</span>
        <input
          type="text"
          placeholder="Enter CAPTCHA"
          value={captchaValue}
          onChange={ev => setCaptchaValue(ev.target.value)}
        />
      </div>
      <button>Login</button>
    </form>
  );
}
