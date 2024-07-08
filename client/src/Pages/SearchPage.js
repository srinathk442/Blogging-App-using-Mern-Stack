import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/search?title=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div className="search-page">
      <div className="search-bar">
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Search by title" 
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>
      <div className="search-results">
        {results.map((post) => (
          <div key={post._id} className="search-result-item">
            <Link to={`/post/${post._id}`} className="search-result-title">
              <h2>{post.title}</h2>
            </Link>
            <p className="search-result-summary">{post.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
