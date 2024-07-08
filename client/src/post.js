import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({_id, title, description, cover, content, createdAt, author}) {

  const wordCount = (text) => {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  };

  const calculateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const count = wordCount(text);
    const time = Math.ceil(count / wordsPerMinute);
    if (time===1){
        return `Reading time: ${time} minute`
    }
    else{
      return `Reading time: ${time} minutes`
    }
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
        <p className="info">
          <a className="author">{author.username}</a>&nbsp;
          <time>{formatISO9075(new Date(createdAt))}</time>
          <b><p className="word-count">Word Count: {wordCount(content)}</p></b>
          <b><p className="reading-time">{calculateReadingTime(content)}</p></b>
        </p>
        <p className="summary">{description}</p>
      </div>
    </div>
  );
}
