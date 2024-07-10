import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";
import { Link } from 'react-router-dom';

export default function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/post/${id}`)
      .then(response => response.json())
      .then(postInfo => {
        setPostInfo(postInfo);
      })
      .catch(err => setError(err.message));
  }, [id]);

  async function deletePost(event) {
    event.preventDefault();
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/post/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        navigate("/index");
      } else {
        const jsonResponse = await response.json();
        setError(jsonResponse.message || 'Failed to delete the post');
      }
    } catch (err) {
      setError(err.message);
    }
  }

  if (!postInfo) return null;
  const isAuthor = userInfo && userInfo.id === postInfo.author._id;

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      {postInfo.createdAt && (
        <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
      )}
      <div className="author">by @{postInfo.author.username}</div>
      {isAuthor && (
        <div className="edit-row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <Link className="btn edit-btn" to={`/edit/${postInfo._id}`} style={{ textAlign: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            Edit this post
          </Link>
        </div>
      )}
      <br></br>
      <div className="image">
        <img src={`${process.env.REACT_APP_SERVER_URL}/${postInfo.cover}`} alt=""/>
      </div>
      <div className="content" dangerouslySetInnerHTML={{ __html: postInfo.content }} />
      {isAuthor && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <Link
            to="#"
            onClick={deletePost}
            className="btn delete-btn"
            style={{ backgroundColor: 'black', color: 'white' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h12M9 6V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V6m3 0v13.5A2.25 2.25 0 0 1 15.75 21H8.25A2.25 2.25 0 0 1 6 19.5V6h12Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v6M14 11v6" />
            </svg>
            Delete post
          </Link>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
