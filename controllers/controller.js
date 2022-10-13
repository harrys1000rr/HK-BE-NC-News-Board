const {selectTopics,deleteCommentById,selectArticleById,selectUsers,patchArticleById,selectArticles,createCommentByArticleId} = require('../models/model.js')

const endpoints = require("../endpoints.json");


exports.listEndpoints = (req, res) => {
  res.status(200).send(endpoints)
  
}

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

  exports.getArticles = (req, res, next) => {
    const sortBy = req.query.sort_by;
    const orderBy = req.query.order;
    const topic = req.query.topic;
    selectArticles(sortBy, orderBy, topic)
      .then((articles) => {
        res.status(200).send({ articles });
      })
      .catch(next);
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

exports.deleteComments = (req, res, next) => {
  const commentId = req.params.comment_id;
  deleteCommentById(commentId)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
       
  }

