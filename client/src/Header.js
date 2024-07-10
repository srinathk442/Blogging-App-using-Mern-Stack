import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, [setUserInfo]);

  function logout() {
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    }).then(() => {
      setUserInfo(null);
      navigate('/'); // Redirect to home page after logout
    });
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">Lifestyle Blender</Link>
      <nav>
        {!username && <Link to="/">Home</Link>}
        {username && (
          <>
            <Link to="/search">Search</Link>
            <Link to="/financial">Financial Blogs</Link>
            <Link to="/sports">Sports Blogs</Link>
            <Link to="/business">Business Blogs</Link>
            <Link to="/education">Education Blogs</Link>
            <Link to="/create">Create new post</Link>
            <Link to="/logout" onClick={logout}>Logout</Link>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
