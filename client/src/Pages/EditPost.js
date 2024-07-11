import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "./Editor";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/post/${id}`)
      .then(response => response.text())
      .then(text => {
        try {
          const postInfo = JSON.parse(text);
          setTitle(postInfo.title);
          setContent(postInfo.content);
          setSummary(postInfo.summary);
        } catch (err) {
          console.error('Failed to parse JSON:', text);
          setError('Failed to fetch post data');
        }
      })
      .catch(err => setError(err.message));
  }, [id]);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);
    if (file) {
      data.set('file', file);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/post/${id}`, {
        method: 'PUT',
        body: data,
        credentials: 'include',
      });

      const responseText = await response.text();
      try {
        const jsonResponse = JSON.parse(responseText);
        if (response.ok) {
          setRedirect(true);
        } else {
          setError(jsonResponse.message || 'Failed to update the post');
        }
      } catch (err) {
        console.error('Failed to parse JSON:', responseText);
        setError('Unexpected server response');
      }
    } catch (err) {
      setError(err.message);
    }
  }

  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
  }

  return (
    <form onSubmit={updatePost}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
        onChange={ev => setFile(ev.target.files[0])}
      />
      <Editor onChange={setContent} value={content} />
      <button style={{ marginTop: '5px' }}>Update post</button>
    </form>
  );
}
