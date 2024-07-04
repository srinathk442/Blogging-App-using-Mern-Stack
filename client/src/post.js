export default function Post() {
    return (
      <>
      <div className="post">
        <div className="image">
          <img src="https://techcrunch.com/wp-content/uploads/2024/05/Instagram-Threads-GettyImages-1795093602.jpeg?resize=768,466" alt=""/>
        </div>
        <div className="post-info">
          <h2>Threads nears its one-year anniversary with more than 175M monthly active users</h2>
          <p className="info">
            <span className="author">Abhinav Malik</span>
            <time>2023-01-06 16:45</time>
          </p>
          <p className="summary">
          Meta’s Threads now has more than 175 million monthly active users, Mark Zuckerberg announced on Wednesday. The announcement comes two days away from Threads’ first anniversary. Zuckerberg revealed back in April that Threads had more than 150 million monthly active users, up from the 130 million reported in February.
          </p>
        </div>
      </div>
      <hr className="post-separator" />
      </>
      
      
    );
  }
  