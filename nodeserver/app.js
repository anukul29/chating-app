const express = require('express');
const cors = require('cors');
const app = express();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5500', // Replace with the appropriate origin of your client-side application
}));

// Rest of your server code

// Start the server
app.listen(8000, () => {
  console.log('Server started on port 8000');
});



// index.js
// Node server which will handle socket io connections
const io = require('socket.io')(8000)

const users = {};

io.on('connection', socket =>{
    // If any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name =>{ 
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends a message, broadcast it to other people
    socket.on('send', message =>{
    });

    // If someone leaves the chat, let others know 
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });


})





// client.js
const socket = io('http://localhost:8000');

// Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")

// Audio that will play on receiving messages
var audio = new Audio('ting.mp3');

// Function which will append event info to the contaner
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position =='left'){ 
        audio.play();
    }
}


// Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// If a new user joins, receive his/her name from the server
socket.on('user-joined', name =>{
    append(`${name} joined the chat`, 'right')
})

// If server sends a message, receive it
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left')
})

// If a user leaves the chat, append the info to the container
socket.on('left', name =>{
    append(`${name} left the chat`, 'right')
})

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''
})



// style
body{
  height: 100vh;
  background-image: linear-gradient(rgb(255, 255, 255), rgb(109, 39, 239));
}

.logo{
  display: block;
  margin: auto;
  width: 50px;
  height: 50px;
}
h1{
  margin-top: 12px;
  font-size: 30px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
}
.container{
  max-width: 955px;
  border: 2px solid black;
  border-radius: 13px;
  margin: auto;
  height: 60vh;
  padding: 33px;
  overflow-y: auto;
  margin-bottom: 23px;
}

.message{
  background-color: rgb(211, 204, 204);
  width: 24%;
  padding: 10px;
  margin: 17px 12px;
  border: 2px solid black;
  border-radius: 10px;
}
.left{
  float: left;
  clear:both;
}

.right{
  float: right;
  clear:both;
}

#send-container{
  display:block;
  margin: auto;
  text-align: center;
  max-width: 1085px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
#messageInp{
  width: 80%;
  border: 2px solid black;
  border-radius: 6px;
  height: 34px;
  font-size: 22px;
}

.btn{
  margin: 0 5px;
  width: 9%;
  cursor: pointer;
  border: 2px solid black;
  border-radius: 6px;
  height: 34px;
}





// html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>iChat - Realtime Node Socket.io Chat App</title>
    <script defer src="http://localhost:8000/socket.io/socket.io.js"></script>
    <script defer src="js/client.js"></script>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <nav>
        <img class="logo" src="chat.png" alt="">
        <h1>Welcome to iChat App</h1>
    </nav>
    <div class="container"></div> 
    <div class="send">
        <form action="#" id="send-container">
            <input type="text" name="messageInp" id="messageInp">
            <button class="btn" type="submit">Send</button>
        </form>
    </div>
</body>
</html>
