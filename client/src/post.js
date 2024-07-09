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
          <img src={`http://localhost:4000/${cover}`} alt={title} />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <Link to={`/author/${author._id}`} className="author">{author.username}</Link>&nbsp;
          <time>{format(new Date(createdAt), "PPP")}</time>
          <b><p className="word-count">Word Count: {wordCount(content)}</p></b>
          <b><p className="reading-time">{calculateReadingTime(content)}</p></b>
        </p>
        <p className="summary">{description}</p>
      </div>
    </div>
  );
}
