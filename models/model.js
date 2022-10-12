const db = require('../db/connection.js')


exports.selectTopics = () => {
    return db
    .query('SELECT * FROM topics')
    .then((results) => {
        return results.rows
    })
}

exports.selectArticleById = (id) => {
    return db
      .query(
        'SELECT articles.*, COUNT(comment_id)AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = $1 WHERE articles.article_id = $1 GROUP BY articles.article_id;',
        [id]
      )
      .then((result) => {
        if (result["rowCount"] === 0) {

          return Promise.reject({ status: 404, msg: 'Articles not found'});
        }
        return result.rows[0];
      });
  };
  
  exports.selectUsers = () => {
    return db
    .query('SELECT * FROM users')
    .then((results) => {
        return results.rows
    })
}
exports.selectArticles = (
  sortBy = "created_at",
  orderBy = "DESC",
  topic,
) => {
  let topicCondition = false;
  if (!topic) {
    topicCondition = true;
  }
  const allowedSortBy = [
    "article_id",
    "title",
    "body",
    "votes",
    "author",
    "topic",
    "created_at",
    "comment_count",
  ];

  if (!allowedSortBy.includes(sortBy)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  const allowedOrder = ["ASC", "DESC", "asc", "desc"];
  if (!allowedOrder.includes(orderBy)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db.query(
      `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments
      ON articles.article_id = comments.article_id
      WHERE ${topicCondition} OR topic = $1
      GROUP BY articles.article_id
      ORDER BY ${sortBy} ${orderBy}`,[topic]
    )
    .then(({ rows }) => {
      return rows;
    });
};

  exports.createCommentByArticleId = (author, body, commentArticleId) => {
    return db.query(
        `INSERT INTO comments (author, body, article_id) 
      VALUES($1,$2,$3) RETURNING *;`,
        [author, body, commentArticleId]
      )
      .then((comment) => {
        return comment.rows[0];
      });
  };