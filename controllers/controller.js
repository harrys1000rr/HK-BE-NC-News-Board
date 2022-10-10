const {selectTopics,selectArticleById} = require('../models/model.js')


exports.getTopics = (req, res) => {
    selectTopics()
    .then((topics) => {
        res.status(200).send({topics})
    })

}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id)
      .then((response) => {
        console.log(response)
        res.status(200).send({ article: response });
      })
      .catch((err) => {
        next(err);
      });
  };

