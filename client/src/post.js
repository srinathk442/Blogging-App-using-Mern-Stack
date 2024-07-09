import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({ _id, title, description, cover, content, createdAt, author }) {

  const wordCount = (text) => {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  };

  const calculateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const count = wordCount(text);
    const time = Math.ceil(count / wordsPerMinute);
    return time === 1 ? `Reading time: ${time} minute` : `Reading time: ${time} minutes`;
  };

  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={`${process.env.REACT_APP_SERVER_URL}/` + cover} alt="" />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <div className="info">
          <span className="author">{author.username}</span>&nbsp;
          <time>{formatISO9075(new Date(createdAt))}</time>
          <div className="word-count">
            <b>Word Count:</b> {wordCount(content)}
          </div>
          <div className="reading-time">
            <b>{calculateReadingTime(content)}</b>
          </div>
        </div>
        <p className="summary">{description}</p>
      </div>
    </div>
  );
}
