const express = require('express')
const app = express()
const bcrypt = require('bcryptjs')
const dbmock = require('./db.json');

app.use(express.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Expose-Headers", "X-Total-Count");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

//HTTP METHODS OF USERS
app.get('/users', async (req, res) => {
  const total = dbmock.users.length;
  res.set("X-Total-Count", total);
  res.json(dbmock.users);
})

app.post('/users', async (req, res) => {
  try {
    var salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    const user = req.body
    user.password = hashedPassword
    console.log(req.body)
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
      var salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(user.password, salt);
      user.password = hashedPassword;
      res.json(user)
    } else {
        res.status(401).send() 
    }
  } catch {
    res.status(500).send()
  }
})

//HTTP METHODS OF POSTS
app.get('/posts/:id', (req, res) => {
  const idPost = req.params.id;
  if(idPost === ''){
    res.status(500).send(res.statusText)
  } else {
    const post = dbmock.posts.find(post => post.id.toString() === idPost);
    res.json(post);
  }
})

app.get('/posts', (req, res) => {
  const total = dbmock.posts.length;
  res.set("X-Total-Count", total);
  res.json(dbmock.posts);
})

app.post('/posts', (req, res) => {
  res.set("Access-Control-Allow-Methods", "POST");
  console.log(req.body)
  try {
    const post = req.body
    dbmock.posts.push(post)
    res.status(201).send()
  } catch {
    res.status(500).send(res.statusText)
  }
})


//HTTP METHODS OF ROLES
app.get('/roles', (req, res) => {
  const total = dbmock.roles.length;
  res.set("X-Total-Count", total);
  res.json(dbmock.roles)
})

//HTTP METHODS OF COMMENT
app.get('/comments', async (req, res) => {
  const total = dbmock.comments.length;
  res.set("X-Total-Count", total);
  res.json(dbmock.comments);
})

//HTTP METHODS OF ALBUMS
app.get('/albums', async (req, res) => {
  const total = dbmock.albums.length;
  res.set("X-Total-Count", total);
  res.json(dbmock.albums);
})

//HTTP METHODS OF PHOTOS
app.get('/photos', async (req, res) => {
  const total = dbmock.photos.length;
  res.set("X-Total-Count", total);
  res.json(dbmock.photos);
})





app.listen(3000)