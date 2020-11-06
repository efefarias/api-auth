const express = require('express')
const app = express()
const bcrypt = require('bcryptjs')
const dbmock = require('./db.json');

app.use(express.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Total-Count");
  next();
});

app.get('/users', (req, res) => {
  res.json(dbmock.users)
})

app.get('/roles', (req, res) => {
  res.json(dbmock.roles)
})

app.get('/posts', (req, res) => {
  res.json(dbmock.posts)
})

app.post('/users', async (req, res) => {
  try {
    var salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    const user = req.body
    user.password = hashedPassword
    dbmock.users.push(user)
    res.status(201).send()
  } catch {
    res.status(500).send(res.statusText)
  }
})

app.post('/users/login', async (req, res) => {
  const user = dbmock.users.find(user => user.username === req.body.username)
  if (user == null) {
    return res.status(400).send()
  }
  try {
    if(await bcrypt.compareSync(user.password, req.body.hashedPassword)) {
      res.json(user)
    } else {
        res.status(401).send() 
    }
  } catch {
    res.status(500).send()
  }
})

app.listen(3000)