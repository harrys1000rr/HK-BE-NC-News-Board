const express = require('express');
const cors = require('cors');
const {getTopics,getArticleById,getUsers,updateArticleById,getArticles} = require('./controllers/controller.js');


const app = express();
app.use(cors());
app.use(express.json())


app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/users', getUsers);

app.patch('/api/articles/:article_id', updateArticleById);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Invalid URL' });
});

app.use((err,req,res,next) => {
  if (err.msg === 'Topic does not exist') {
      res.status(404).send({msg: 'Topic does not exist'})} 
else if
  (err.code === '22P02') {
  res.status(400).send({msg: 'Invalid id type!'})} 
  else if 
    (err.msg==='Invalid sort order') {
      res.status(400).send({msg: 'Invalid sort order'})} 
    else if
    (err.code === '42703') {
      res.status(400).send({msg: 'Invalid column sort query'})} 
    else 
  {next(err)}}
  )
  app.use((err,req,res,next) => {

    res.status(500).send({msg: 'Something went wrong!'})
    })

module.exports = app;