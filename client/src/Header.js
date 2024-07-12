import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  
  

  function logout() {
    fetch(`${process.env.REACT_APP_SERVER_URL}/logout`, {
      credentials: 'include',
      method: 'POST',
    }).then(() => {
      setUserInfo(null);
      navigate('/');
    });
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">Lifestyle Blender</Link>
      <nav>
        {username && (
          <>
           <Link to='/'>Home</Link>
           <Link to="/index">View Posts</Link>
            <Link to="/search">Search</Link>
            <Link to="/post">Create new post</Link>
            <Link to="/logout" onClick={logout}>Logout</Link>
          </>
        )}
        {!username && (
          <>
            <Link to="/index">View Posts</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
