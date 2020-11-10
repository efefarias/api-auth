const bcryptjs = require('bcryptjs')
const express = require('express')
const app = express()
const dbmock = require('./db.json')

app.use(express.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Expose-Headers", "X-Total-Count")
  res.header("Access-Control-Allow-Methods", "*")
  next()
})

app.post('/users/login', async (req, res) => {
  console.log(req.body)
  const user = dbmock.users.find(user => user.username === req.body.username)
  if (user == null) {
    return res.status(400).send()
  }
  try {
    if(await bcryptjs.compareSync(user.password, req.body.hashedPassword)) {
      res.json(user)
    } else {
        res.status(401).send() 
    }
  } catch {
    res.status(500).send()
  }
})

app.get('/users', (req, res) => {
  const page = req.query.page
  const limit = req.query.perPage
  const filter = req.query.filter
  const order = req.query.order

  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  const resultUsers = dbmock.users.slice(startIndex, endIndex)
  
  const total = dbmock.users.length
  res.set("X-Total-Count", total)
  res.json(resultUsers)
})

app.get('/posts', (req, res) => {
  const page = req.query.page
  const limit = req.query.perPage
  const filter = req.query.filter
  const order = req.query.order

  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  const resultPosts = dbmock.posts.slice(startIndex, endIndex)
  
  const total = dbmock.posts.length
  res.set("X-Total-Count", total)
  res.json(resultPosts)
})

//HTTP METHODS OF COMMENTS
app.get('/comments', (req, res) => {
  const page = req.query.page
  const limit = req.query.perPage
  const filter = req.query.filter
  const order = req.query.order

  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  const resultComments = dbmock.comments.slice(startIndex, endIndex)
  
  const total = dbmock.comments.length
  res.set("X-Total-Count", total)
  res.json(resultComments)
})

//HTTP METHODS OF ALBUMS
app.get('/albums', (req, res) => {
  const page = req.query.page
  const limit = req.query.perPage
  const filter = req.query.filter
  const order = req.query.order

  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  const resultAlbums = dbmock.albums.slice(startIndex, endIndex)
  
  const total = dbmock.albums.length
  res.set("X-Total-Count", total)
  res.json(resultAlbums)
})

//HTTP METHODS OF PHOTOS
app.get('/photos', (req, res) => {
  const page = req.query.page
  const limit = req.query.perPage
  const filter = req.query.filter
  const order = req.query.order

  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  const resultPhotos = dbmock.photos.slice(startIndex, endIndex)
  
  const total = dbmock.photos.length
  res.set("X-Total-Count", total)
  res.json(resultPhotos)
})

//HTTP METHODS OF TODOS
app.get('/todos', (req, res) => {
  const page = req.query.page
  const limit = req.query.perPage
  const filter = req.query.filter
  const order = req.query.order

  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  const resultTodos = dbmock.todos.slice(startIndex, endIndex)
  
  const total = dbmock.todos.length
  res.set("X-Total-Count", total)
  res.json(resultTodos)
})

app.listen(3001)