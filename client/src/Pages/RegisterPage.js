import { useState } from "react";
import '../App.css'; 

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function register(ev) {
    ev.preventDefault();
    const response = await fetch('http://localhost:4000/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 200) {
      alert('Registration successful');
    } else {
      alert('Registration failed');
    }
  }

  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={ev => setEmail(ev.target.value)}
        autoComplete="off"
      />
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
      <div className="checkbox-container">
      <label><center>Show Password</center><input
          type="checkbox"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
        /></label></div>
      <button>Register</button>
    </form>
  );
}
