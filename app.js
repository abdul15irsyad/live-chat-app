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
app.set('view engine','pug')
app.set('views','./public/views')

// port
const port = process.env.PORT || 8002

// static file path
app.use(express.static(__dirname+'/public'))

// connect to mongodb with mongoose
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
},err=>{
  if (err) throw err
  console.log("success connect mongodb")
})

// homepage & routes
app.get('/',(req,res)=>{
  res.render('./index',{APP_URL:process.env.APP_URL})
})
app.use('/chat',chatRouter )

// socket
let users = []
io.on('connection',(socket)=>{
  socket.on('send-message',data=>{
    socket.broadcast.emit('messages',{name:users.find(user=>user.id==socket.id).name,message:data.message})
  })
  socket.on('input-name',data=>{
    let name = data.name.trim()
    if(users.indexOf(name)==-1){
      let user = {
        id: socket.id,
        name: name
      }
      users.push(user)
      socket.broadcast.emit('user-joined',{name:name,users})
      socket.emit('success-joined',{name:name,users})
      console.log(`${name} joined`)
    }else{
      socket.emit('failed-joined',{name})
    }
  })
  socket.on('disconnect',()=>{
    let disconnectUser = users.find(user=>user.id==socket.id)
    if(disconnectUser){
      users = users.filter(user=>user.id!=socket.id)
      socket.broadcast.emit('user-disconnect',{name:disconnectUser.name,users})
      console.log(`${disconnectUser.name} leaved`)
    }
  })
})

// start the server
server.listen(port,()=>console.log(`server running on ${process.env.APP_URL}`))