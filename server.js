
const express = require('express');
const bodyParser= require('body-parser')
const path = require('path')

const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const app = express()


app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')))

var url = "mongodb://localhost:27017/my-mongo-db";

MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
  if (err) return console.log(err)
  let dba = db.db('my-mongo-db')

  app.listen(3000, () => {
    console.log('Escutando na porta 3000')
  })

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
  })

  //Retorna usuários
  app.get('/users', (req, res) => {
    dba.collection('users').find().toArray(function(err, users) {
      if (err) return res.status(500).send(err);
      res.send(users);
    })
  })

  //Retorna somente um usuário por id
  app.get('/user/:id', (req, res) => {
    dba.collection('users').findOne({_id: ObjectId(req.params.id)}, (err, user) => {
      if (err) return res.status(500).send(err);
      res.send(user);
    })
  })

  //Cadastra um usuário
  app.post('/users', (req, res) => {
    dba.collection('users').insertOne(req.body, (err, result) => {
      if (err) return res.status(500).send(err);
      console.log("Inserção realizada");
      res.send({message:'Usuário salvo com sucesso'});
    })
  })

  //Delete um usuário
  app.delete('/user/:id', (req, res) => {
    dba.collection('users').deleteOne({_id: ObjectId(req.params.id)},(err, result) => {
      if (err) return res.status(500).send(err);
      console.log("Exclusão realizada");
      res.send({message:'Usuário removido com sucesso'});
    })
  })

  //Altera um usuário consultado por id
  app.put('/user/:id', (req, res) => {
    dba.collection('users').updateOne({_id: ObjectId(req.params.id)}, {$set: req.body}, {upsert: false}, (err, result) => {
      if (err) return res.status(500).send(err);
      console.log("Alteração realizada");
      res.send({message:'Usuário alterado com sucesso'});
    })
  })
})
