const {selectTopics,selectArticleById,selectUsers,patchArticleById,selectArticles,createCommentByArticleId} = require('../models/model.js')



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

  exports.getArticles = (request, response,next) => {
    const { topic } = request.query
    selectArticles(topic).then((articles) => {
        response.status(200).send({ articles })
    })
    .catch((err) => {
        next(err);
      });
  };
  exports.postCommentsByArticleId = (req, res, next) => {
    const author = req.body.username;
    const body = req.body.body;
    const commentArticleId = req.params.article_id;
    createCommentByArticleId(author,body,commentArticleId).then((comment) => {
    return res.status(201).send({ comment });
})
.catch((err) => {
    next(err);
    });
     
}
  