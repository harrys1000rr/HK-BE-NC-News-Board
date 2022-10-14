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

exports.selectArticles = async (
  sort_by = "created_at",
  order = "DESC",
  topic
) => {
  // input validation
  // sort_by must be ascending or descending
  if (order.toUpperCase() !== "ASC" && order.toUpperCase() !== "DESC") {
    return Promise.reject({
      status: 400,
      msg: "Invalid sort order",
    });
  }

  // topic has to exist in the database
  if (topic) {
    const validTopics = await db.query(`SELECT slug FROM topics;`);
    const isTopicValid = validTopics.rows.some((validTopic) => {
      return topic === validTopic.slug;
    });
    if (!isTopicValid) {
      return Promise.reject({
        status: 404,
        msg: "Topic does not exist",
      });
    }

  }

  // base query
  let queryStr = `
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, CAST(COUNT(comments.comment_id) AS INT) AS comment_count
  FROM articles
  LEFT JOIN comments ON (articles.article_id = comments.article_id) `;

  // modular query construction based on what was queried
  if (topic) {
    queryStr += `
  WHERE articles.topic = '${topic}'`;
  }
  queryStr += `
  GROUP BY articles.article_id`;
  if (sort_by) {
    queryStr += `
    ORDER BY ${sort_by}`;
    if (order) queryStr += ` ${order.toUpperCase()}`;
  }
  queryStr += ";";

  // output
  const selectedArticles = await db.query(queryStr);

  return selectedArticles.rows;
};
