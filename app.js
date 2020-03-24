// import
const express = require('express'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  app = express(),
  server = require('http').Server(app),
  io = require('socket.io')(server),
  chatRouter = require('./routes/chat'),
  Chat = require('./models/Chat')

// config
require('dotenv').config()
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());

// port
const port = process.env.PORT || 8002

// static file path
app.use(express.static(__dirname+'/public'))

// connect to mongodb with mongoose
mongoose.connect("mongodb://127.0.0.1:27017/io-chat", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

// homepage & routes
app.get('/',(req,res)=>{
  res.sendFile('index.html')
})
app.use('/chat',chatRouter )

// socket
let users = {}
io.on('connection',(socket)=>{
  socket.on('send-message',data=>{
    socket.broadcast.emit('messages',{name:users[socket.id],message:data.message})
  })
  socket.on('input-name',data=>{
    let name = data.name.trim()
    if(Object.values(users).indexOf(name)==-1){
      users[socket.id] = name
      socket.broadcast.emit('user-joined',{name:name,users})
      socket.emit('success-joined',{name:name,users})
    }else{
      socket.emit('failed-joined',{name})
    }
  })
  socket.on('disconnect',()=>{
    let disconnectUser = users[socket.id]
    if(users[socket.id]){
      delete users[socket.id]
      socket.broadcast.emit('user-disconnect',{name:disconnectUser,users})
    }
  })
})

// start the server
server.listen(port,()=>console.log(`server running on http://localhost:${port}`))