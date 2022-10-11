const express = require('express');
const {getTopics,getArticleById,getUsers,updateArticleById} = require('./controllers/controller.js');

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/users', getUsers);

app.patch('/api/articles/:article_id', updateArticleById);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Invalid URL' });
});

app.use((err,req,res,next) => {
  console.log(err)
  if (err.code === '22P02') {
    console.log(err)
  res.status(400).send({msg: 'Invalid id type!'})} 
  else if (err.status) {
    res.status(404).send({msg: 'Article with this ID not found.'})} 
    else 
  {next(err)}})

  app.use((err,req,res,next) => {
    res.status(500).send({msg: 'Something went wrong!'})
    })

module.exports = app;