<<<<<<< HEAD
import { format } from "date-fns"; 
=======
import { formatISO9075 } from "date-fns";
>>>>>>> adb6cd94128f74fb6140ed4fe95e4e12c7ef6573
import { Link } from "react-router-dom";

export default function Post({ _id, title, description, cover, content, createdAt, author }) {

  const wordCount = (text) => {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  };

  const calculateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const count = wordCount(text);
    const time = Math.ceil(count / wordsPerMinute);
<<<<<<< HEAD
    return `Reading time: ${time} minute${time === 1 ? '' : 's'}`; 
=======
    return time === 1 ? `Reading time: ${time} minute` : `Reading time: ${time} minutes`;
>>>>>>> adb6cd94128f74fb6140ed4fe95e4e12c7ef6573
  };

  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
<<<<<<< HEAD
          <img src={`http://localhost:4000/${cover}`} alt={title} />
=======
          <img src={`${process.env.REACT_APP_SERVER_URL}/` + cover} alt="" />
>>>>>>> adb6cd94128f74fb6140ed4fe95e4e12c7ef6573
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
<<<<<<< HEAD
        <p className="info">
          <Link to={`/author/${author._id}`} className="author">{author.username}</Link>&nbsp;
          <time>{format(new Date(createdAt), "PPP")}</time>
          <b><p className="word-count">Word Count: {wordCount(content)}</p></b>
          <b><p className="reading-time">{calculateReadingTime(content)}</p></b>
        </p>
=======
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
>>>>>>> adb6cd94128f74fb6140ed4fe95e4e12c7ef6573
        <p className="summary">{description}</p>
      </div>
    </div>
  );
}
