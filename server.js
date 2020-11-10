const bcryptjs = require('bcryptjs')
const express = require('express')
const app = express()
const dbmock = require('./db.json')
const roleAdmin = "1";

app.use(express.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Expose-Headers", "X-Total-Count")
  res.header("Access-Control-Allow-Methods", "*")
  next()
})

app.post('/users/login', async (req, res) => {
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
  res.json(resultUsers.slice(startIndex, endIndex))
})

app.get('/posts', (req, res) => {
  let resultPosts = []
  const page = req.query.page
  const limit = req.query.perPage
  const roleId = req.query.roleId
  const userId = req.query.Id
  const filter = req.query.filter
  const order = req.query.order

  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  if(roleId === roleAdmin) {
    const total = dbmock.posts.length
    res.set("X-Total-Count", total)
    res.json(dbmock.posts.slice(startIndex, endIndex))
  } else {
    dbmock.posts.forEach(post => {
      if(post.userId.toString() === req.query.Id){
        resultPosts.push(post);
      }
    });
  }

  const total = resultPosts.length
  res.set("X-Total-Count", total)
  res.json(resultPosts.slice(startIndex, endIndex))
})

//HTTP METHODS OF COMMENTS
app.get('/comments', (req, res) => {
  let resultPosts = []
  let resultComments = []
  const page = req.query.page
  const limit = req.query.perPage
  const roleId = req.query.roleId
  const userId = req.query.Id
  const filter = req.query.filter
  const order = req.query.order

  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  if(roleId === roleAdmin) {
    const total = dbmock.comments.length
    res.set("X-Total-Count", total)
    res.json(dbmock.comments.slice(startIndex, endIndex))
  } else {
    dbmock.posts.forEach(post => {
      if(post.userId.toString() === req.query.Id){
        resultPosts.push(post);
      }
    });
    resultPosts.forEach(post => {
      dbmock.comments.forEach(comment => {
        if(post.id === comment.postId)
          resultComments.push(comment);
      })
    });
  }
  
  const total = resultComments.length
  res.set("X-Total-Count", total)
  res.json(resultComments.slice(startIndex, endIndex))
})

//HTTP METHODS OF ALBUMS
app.get('/albums', (req, res) => {
  let resultAlbums = []
  const page = req.query.page
  const limit = req.query.perPage
  const roleId = req.query.roleId
  const userId = req.query.Id
  const filter = req.query.filter
  const order = req.query.order

  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  if(roleId === roleAdmin) {
    const total = dbmock.albums.length
    res.set("X-Total-Count", total)
    res.json(dbmock.albums.slice(startIndex, endIndex))
  } else {
    dbmock.albums.forEach(album => {
      if(album.userId.toString() === req.query.Id){
        resultAlbums.push(album);
      }
    });
  }
  
  const total = resultAlbums.length
  res.set("X-Total-Count", total)
  res.json(resultAlbums.slice(startIndex, endIndex))
})

//HTTP METHODS OF PHOTOS
app.get('/photos', (req, res) => {
  let resultAlbums = []
  let resultPhotos = []
  const page = req.query.page
  const limit = req.query.perPage
  const roleId = req.query.roleId
  const userId = req.query.Id
  const filter = req.query.filter
  const order = req.query.order

  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  if(roleId === roleAdmin) {
    const total = dbmock.photos.length
    res.set("X-Total-Count", total)
    res.json(dbmock.photos.slice(startIndex, endIndex))
  } else {
    dbmock.albums.forEach(album => {
      if(album.userId.toString() === req.query.Id){
        resultAlbums.push(album);
      }
    });
    resultAlbums.forEach(album => {
      dbmock.photos.forEach(photo => {
        if(album.id === photo.albumId)
          resultPhotos.push(photo);
      })
    });
  }
  
  const total = resultPhotos.length
  res.set("X-Total-Count", total)
  res.json(resultPhotos.slice(startIndex, endIndex))
})

//HTTP METHODS OF TODOS
app.get('/todos', (req, res) => {
  let resultTodos = []
  const page = req.query.page
  const limit = req.query.perPage
  const roleId = req.query.roleId
  const userId = req.query.Id
  const filter = req.query.filter
  const order = req.query.order

  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  console.log(roleId, ' ', roleAdmin)
  if (roleId === roleAdmin) {
    const total = dbmock.todos.length
    res.set("X-Total-Count", total)
    res.json(dbmock.todos.slice(startIndex, endIndex))
  } else {
    dbmock.todos.forEach(todo => {
      if(todo.userId.toString() === req.query.Id){
        resultTodos.push(todo);
      }
    });
  }
  
  const total = resultTodos.length
  res.set("X-Total-Count", total)
  res.json(resultTodos.slice(startIndex, endIndex))
})


app.get('/mostCommentedPosts', (req, res) => {
  let resultSet = []
  let qtyComments = 0

  dbmock.posts.forEach(post => {
    dbmock.comments.forEach(comment => {
      if(post.id === comment.postId){
        qtyComments = qtyComments + 1
      }
    });
    post.qtyComments = qtyComments
    resultSet.push(post)
    qtyComments = 0;
  });
  resultSet.sort((a, b) => b.qtyComments - a.qtyComments)
  res.json(resultSet.slice(0, 10))
})

app.listen(3001)