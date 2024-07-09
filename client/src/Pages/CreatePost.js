import 'react-quill/dist/quill.snow.css';
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "./Editor";
import './CreatePost.css'; 

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState('');

  async function createNewPost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    if (files) {
      data.set('file', files[0]);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/post`, { 
        method: 'POST',
        body: data,
        credentials: 'include',
      });

      const contentType = response.headers.get('content-type');
      console.log('Response:', response);

      if (!response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to create post');
        } else {
          const errorText = await response.text();
          setError(`Failed to create post: ${errorText}`);
        }
        return;
      }

      setRedirect(true);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to create post');
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
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
      {error && <p className="error">{error}</p>}
    </form>
  );
}
