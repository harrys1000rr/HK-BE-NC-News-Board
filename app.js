const express = require('express');
const {getTopics,getArticleById,getUsers,updateArticleById,getArticles,postCommentsByArticleId} = require('./controllers/controller.js');

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.post('/api/articles/:article_id/comments', postCommentsByArticleId);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/users', getUsers);

app.patch('/api/articles/:article_id', updateArticleById);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Invalid URL' });
});

app.use((err,req,res,next) => {
  if (err.code === '22P02') {
  res.status(400).send({msg: 'Invalid id type!'})} 
  else if (err.code=23503) {
    res.status(404).send({msg: 'Not found'})} 
  else if (err.status) {
    res.status(404).send({msg: 'Not found'})} 
    else 
  {next(err)}})

  app.use((err,req,res,next) => {
    res.status(500).send({msg: 'Something went wrong!'})
    })

module.exports = app;