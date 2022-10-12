const {selectTopics,selectArticleById,selectUsers,patchArticleById,fetchArticleComments} = require('../models/model.js')


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
    console.log(inc_votes)
    patchArticleById(article_id, inc_votes).then((article) => {
    res.status(200).send({ article })
    })
    .catch((err) => {
        next(err);
      });
  };
    
  exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleComments(article_id)
      .then((comments) => {
        res.status(200).send({ comments });
      })
      .catch((err) => {
        next(err);
      });
  };