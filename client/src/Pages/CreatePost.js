import 'react-quill/dist/quill.snow.css';
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "./Editor";
import './CreatePost.css'; // Import the CSS file

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState(null); // Use null as initial value
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(null); // State to store errors

  async function createNewPost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    if (files && files[0]) {
      data.set('file', files[0]);
    }


    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/post`, {
        method: 'POST',
        body: data,
        credentials: 'include',
      });
      
      if (response.ok) {
        setRedirect(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create post');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    }
  }

  if (redirect) {
    return <Navigate to={'/index'} />
  }

  return (
    <form className="create-post-form" onSubmit={createNewPost}>
      <input 
        type="text"
        placeholder="Title"
        value={title}
        onChange={ev => setTitle(ev.target.value)} 
      />
      <input 
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={ev => setSummary(ev.target.value)} 
      />
      <input 
        type="file"
        onChange={ev => setFiles(ev.target.files)} 
      />
      <Editor value={content} onChange={setContent} />
      <button className="create-post-button">Create post</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
