import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

 

  function logout() {
    fetch(`${process.env.REACT_APP_SERVER_URL}/logout`, {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">Lifestyle Blender</Link>
      <nav>
<<<<<<< HEAD
        <Link to="/">Home</Link> {/* Ensure there is a direct link to Home */}
        <Link to="/search">Search</Link>
        <Link to="#financial">Financial Blogs</Link>
        <Link to="#sports">Sports Blogs</Link>
        <Link to="#business">Business Blogs</Link>
        <Link to="#education">Education Blogs</Link>
        {username && (
          <>
            <Link to="/create">Create new post</Link>
            <Link to="/" onClick={logout}>Logout</Link>
=======
        <Link to="/search">Search</Link> 
        {username && (
          <>
            <Link to="/post">Create new post</Link>
            <Link to="/logout" onClick={logout}>Logout</Link>
>>>>>>> adb6cd94128f74fb6140ed4fe95e4e12c7ef6573
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
