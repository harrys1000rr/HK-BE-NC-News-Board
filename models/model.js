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
        console.log(result)
        // console.log(result)
        if (result["rowCount"] === 0) {

          return Promise.reject({ status: 404, msg: 'Article with this ID not found.'});
        }
        return result.rows[0];
      });
  };
  