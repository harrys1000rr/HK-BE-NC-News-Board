const {selectTopics,selectArticleById,selectUsers,patchArticleById,selectArticles} = require('../models/model.js')


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
        res.status(200).send({ article: response });
      })
      .catch((err) => {
        next(err);
      });
  };

  exports.getUsers = (req, res) => {
    selectUsers()
    .then((users) => {
        res.status(200).send({users})
    })
};

exports.updateArticleById = (req, res,next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    patchArticleById(article_id, inc_votes).then((article) => {
    res.status(200).send({ article })
    })
    .catch((err) => {
        next(err);
      });
  };


  exports.getArticles = async (req, res, next) => {
    const {sort_by, order, topic} = req.query;
  
    try {
      const allArticles = await selectArticles(sort_by, order, topic);
      res.status(200).send({allArticles});
    } catch (err) {
      next(err);
    }
  };