import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({ _id, title, description, cover, content, createdAt, author }) {

  const wordCount = (text) => {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  };

  const calculateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const count = wordCount(text);
    const time = Math.ceil(count / wordsPerMinute);
    return `Reading time: ${time} minute${time === 1 ? '' : 's'}`;
  };

  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={`${process.env.REACT_APP_SERVER_URL}/${cover}`} alt={title} />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <div className="info">
          <Link to={`/author/${author._id}`} className="author">{author.username}</Link>&nbsp;
          <time>{format(new Date(createdAt), "PPP")}</time>
          <b><span className="word-count">Word Count: {wordCount(content)}</span></b>
          <b><span className="reading-time">{calculateReadingTime(content)}</span></b>
        </div>
        <p className="summary">{description}</p>
      </div>
    </div>
  );
}
