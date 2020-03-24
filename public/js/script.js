// enter name at first load
let enterNameDiv = document.querySelector('.enter-name')
// form input name in enter name
let formInputName = document.querySelector("#form-name")
// tag input in form input name
let inputName = document.querySelector('.input-name')
// error message in form input name
let errorName = formInputName.querySelector('p.error')
// the whole messages will appear
let messageContainer = document.querySelector('.messages')
// form input message in the bottom
let formInputMessage = document.querySelector("#form-message")
// tag input in form input message
let inputMessage = document.querySelector('.input-message')
// info how many people was joined the chat (was online)
let joinedUsersDiv = document.querySelector('.joined-users')
// username who in the chat
let username = null

// input name
formInputName.addEventListener('submit',e=>{
  e.preventDefault()
  if(inputMessage&&inputName.value!=""){
    // emit to the server with action 'input-name'
    socket.emit('input-name',{name:inputName.value})
  }
})

// success joined
socket.on('success-joined',data=>{
  // template that show someone has joined or leaved
  let userJoinedDiv = document.querySelector('.user-joined').content.cloneNode(true)
  // tag span.username that inside the userJoinedDiv
  let usernameJoined = userJoinedDiv.querySelector('p')
  // set the global variable username to success input name
  username = data.name
  // make the span.username to 
  usernameJoined.innerHTML = "You joined as "+username
  // appear after the last tag
  messageContainer.appendChild(userJoinedDiv)
  // change the title
  document.title = `Live Chat App - ${data.users.length} people`
  // update people joined
  joinedUsersDiv.innerHTML = data.users.length + " people joined"
  // remove enter name html
  enterNameDiv.parentNode.removeChild(enterNameDiv)
  inputName.value = ""
})

// failed joined
socket.on('failed-joined',data=>{
  // tell the user that the username already used/taken
  errorName.innerHTML = `'${data.name}' is already used !`
  // set to visible the error
  errorName.style.visibility = "visible"
  setTimeout(()=>{
    errorName.style.visibility = "hidden"
  },3000)
})

// send message
formInputMessage.addEventListener('submit',e=>{
  e.preventDefault()
  if(inputMessage&&inputMessage.value!=""){
    // template message that send by this client
    let sendMessage = document.querySelector('.send-message').content.cloneNode(true)
    // the contents of the message
    let messageContent = sendMessage.querySelector('.message p')
    messageContent.innerHTML = inputMessage.value
    // show the message after the last element in message container
    messageContainer.appendChild(sendMessage)
    // emit to the server with aciotn 'send-message'
    socket.emit('send-message',{name:username,message:inputMessage.value})
    // clear the input
    inputMessage.value=""
    // always scroll to bottom when send message
    window.scrollTo(0,document.body.scrollHeight);
  }
})

// received message
socket.on('messages',data=>{
  if(username){
    // template message that send by the other client (received)
    let receivedMessage = document.querySelector('.received-message').content.cloneNode(true)
    // the content of the message
    let message = receivedMessage.querySelector('.message p')
    let messageSender = receivedMessage.querySelector('.name')
    message.innerHTML = data.message
    messageSender.innerHTML = data.name
    messageContainer.appendChild(receivedMessage)
    window.scrollTo(0,document.body.scrollHeight);
  }
})

// someone joined
socket.on('user-joined',data=>{
  if(username){
    let userJoinedDiv = document.querySelector('.user-joined').content.cloneNode(true)
    let username = userJoinedDiv.querySelector('p')
    // inform that someone joined
    username.innerHTML = data.name+" joined"
    // change title
    document.title = `Live Chat App - ${data.users.length} people`
    // update people joined
    joinedUsersDiv.innerHTML = data.users.length + " people joined"
    messageContainer.appendChild(userJoinedDiv)
  }
})

//someone leave
socket.on('user-disconnect',data=>{
  if(username){
    let userJoinedDiv = document.querySelector('.user-joined').content.cloneNode(true)
    let username = userJoinedDiv.querySelector('p')
    let pilUserJoined = userJoinedDiv.querySelector('.pil-user-joined')
    // add class to different between users joined or user leaved
    pilUserJoined.classList.add("user-leaved")
    messageContainer.appendChild(userJoinedDiv)
    username.innerHTML = data.name+" leaved"
    // change title
    document.title = `Live Chat App - ${data.users.length} people`
    // update people joined
    joinedUsersDiv.innerHTML = data.users.length + " people joined"
    window.scrollTo(0,document.body.scrollHeight);
  }
})