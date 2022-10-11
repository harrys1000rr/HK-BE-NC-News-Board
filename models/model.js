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
        `SELECT * from articles where article_id=$1 `,
        [id]
      )
      .then((result) => {
        if (result["rowCount"] === 0) {

          return Promise.reject({ status: 404, msg: 'Article with this ID not found.'});
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
exports.patchArticleById = (article_id, inc_votes) => {return db
    .query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [
      inc_votes,
      article_id,
    ])
    .then((result) => {
        if (result.rows.length === 0) {

            return Promise.reject({ status: 400, msg: 'Article with this ID not found.'});
          }
          return result.rows[0];
        });
    };
    
