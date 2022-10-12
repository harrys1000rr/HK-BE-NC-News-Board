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
exports.selectArticles = (topic) => {
    if (topic!=undefined)
    {
    return db.query('SELECT articles.*, COUNT(comment_id)AS comment_count FROM articles LEFT JOIN comments ON comments.article_id =  articles.article_id where articles.topic=$1 GROUP BY articles.article_id ORDER BY articles.created_at desc',[topic])
    .then((result) => {
            return result.rows;
          });
      }
   else if (topic==undefined){
   return db.query('SELECT articles.*, COUNT(comment_id)AS comment_count FROM articles LEFT JOIN comments ON comments.article_id =  articles.article_id GROUP BY articles.article_id ORDER BY articles.created_at desc')
   .then((result) => {
        return result.rows;
      });
  };}
     
  exports.fetchArticleComments = (article_id) => {
    return db
      .query(`SELECT * FROM comments WHERE article_id = $1`, [article_id])
      .then((res) => {
        if (res.rows.length == 0) {
          return "No comments available for this article!";
        } else return res.rows;
      });
  };