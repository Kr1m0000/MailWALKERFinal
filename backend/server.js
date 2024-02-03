const express = require ('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require ('./routes/user.routes');
const emailRoutes = require ('./routes/email.routes');
const gmailRoutes = require ('./routes/gmail.routes');
const noteRoutes = require ('./routes/note.routes');
const chatRoutes = require ('./routes/chatRoutes');
const messageRoutes = require ('./routes/messageRoutes');


require('dotenv').config({path:'./config/.env'});
require('./config/db');
const {checkUser, requireAuth} = require ('./middleware/auth.middleware');
const cors = require('cors');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//jwt
app.get('*', checkUser );
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
});


app.post('/uploads', upload.single('file'), (req, res) => {
    // req.file contient les informations sur le fichier téléchargé
    res.send('Fichier téléchargé avec succès');
  });
  
  app.use('/uploads', express.static('uploads'))

// routes
app.use('/api/user', userRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/note', noteRoutes);
app.use('/api/gmail', gmailRoutes);

app.use('/api/chat/', chatRoutes); 
app.use('/api/message', messageRoutes);


// server
const server = app.listen(process.env.PORT, () => {
    console.log(`Listenning to port ${process.env.PORT}`);
})

const io = require("socket.io")(server, { //initialise Socket.IO sur le serveur HTTP
    pingTimeout: 60000, // délai d'attente de ping de 60 secondes et autorise les requêtes CORS provenant de "http://localhost:3000"
    cors: {
        origin: "https://mailwalker.vercel.app",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => { // fonction est exécutée chaque fois qu'un client se connecte au serveur
  console.log("Connected to socket.io");
  
  socket.on("setup", (userData) => { //lorsque le client se connecte, il envoie un événement "setup" au serveur avec les données de l'utilisateur
    //userData est un objet contenant des informations sur l'utilisateur qui s'est connecté. Cet objet est envoyé par le 
    //client lorsqu'il émet l'événement "setup"
    socket.join(userData._id);// 
    socket.emit("connected");//le serveur envoie un événement "connected" au client pour confirmer que la connexion a réussi
  });

    //Lorsqu'un utilisateur veut rejoindre une conversation, il envoie un événement "join chat" avec l'identifiant de la 
  //conversation comme room. Le serveur reçoit cet événement, et avec socket.join(room), il ajoute le client à cette room.
  // Ainsi, lorsque des messages sont envoyés dans cette conversation, seuls les clients dans cette room les reçoivent.

  socket.on("join chat", (room) => { //Lorsqu'un événement "join chat" est reçu (envoyer par le client), le serveur fait rejoindre au client la salle spécifiée
    socket.join(room); // le serveur ajoute le client à la salle spécifiée
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing")); //Lorsque le serveur reçoit un événement "typing" d'un client, il émet à son tour un événement "typing" à tous les autres clients dans la même "room".
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {// Lorsque le serveur reçoit un événement "new message" d'un client, il émet à son tour un événement "message received" à tous les autres clients dans la même "room".
  //   if (!newMessageRecieved.chat) {
  //   return console.log("newMessageRecieved.chat not defined");
  // }
    var chat = newMessageRecieved.chat; //extrait l'objet chat du message reçu

    if (!chat.users) {
      return console.log("chat.users not defined");
    } // vérifie si l'objet chat a une propriété users

    chat.users.forEach((user) => { //parcourt chaque utilisateur dans chat.users.
      if (user._id == newMessageRecieved.sender._id) {
        return;
      }// Si l'ID de l'utilisateur est le même que l'ID de l'expéditeur du message, la fonction retourne immédiatement, ce qui signifie que le message n'est pas envoyé à l'expéditeur

      socket.in(user._id).emit("message recieved", newMessageRecieved); // Pour chaque utilisateur dans chat.users qui n'est pas l'expéditeur, le serveur envoie un événement "message received" avec le message original. Cela signifie que chaque utilisateur du chat reçoit le nouveau message
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
