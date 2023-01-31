/**
 * Basic example demonstrating passport-steam usage within Express framework
 */
const axios = require("axios")
var https = require('https');
var fs = require('fs');
var cors = require('cors')
const path = require('path')
var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , session = require('express-session')
  , SteamStrategy = require('../../').Strategy;
require("dotenv").config()
var bodyParser = require('body-parser')
// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


const { PrismaClient } = require('@prisma/client');
const { response } = require("express");

const prisma = new PrismaClient()

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Steam profile is serialized
//   and deserialized.

let apiKey = process.env.Key;
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// Use the SteamStrategy within Passport.
//   Strategies in passport require a `validate` function, which accept
//   credentials (in this case, an OpenID identifier and profile), and invoke a
//   callback with a user object.



passport.use(new SteamStrategy({
  returnURL: 'http://localhost:3000/auth/steam/return',
  realm: 'http://localhost:3000/',
  apiKey: apiKey
},
  function (identifier, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Steam profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Steam account with a user record in your database,
      // and return that user instead.
      profile.identifier = identifier;
      return done(null, profile);
    });
  }
));

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:4200']
  }
});

const socketIdMap = new Map();

;

var app = express();

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cors())
app.use(session({
  secret: 'your secret',
  name: 'name of session id',
  resave: true,
  saveUninitialized: true
}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use('/static',express.static(__dirname + '/../../public'));

app.get('/saveuser', ensureAuthenticated , async function (req, res) {
 
  console.log(req.user)
  const fetchUser = await prisma.user.findUnique({
    where: {
      id: req.user.user_id
    }
  })
  if (fetchUser == null) {
    // console.log("user not found ")

    const newUser = await prisma.User.create({
      data: {
        id: req.user.user_id,
        name: req.user.name
      },
    })

    download(req.user.picture , req.user.user_id  ,res , req)



    console.log("new user created", newUser)
  }else{
    console.log("user exists")
  }

 
 
});

app.get('/account', ensureAuthenticated, async function (req, res) {
  res.sendFile(__dirname + '/client/account.html')
});

app.get('/friend', ensureAuthenticated, async function (req, res) {
  res.sendFile(__dirname + '/client/friend.html')
});

app.get("/accountData", async (req, res) => {
  const c = await axios.get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${req.user.id}&include_appinfo=true&format=json`);
  let games = c.data.response.games;
  if (games == undefined || games == null) {
    games = []
  }

  res.send(JSON.stringify({ user: req.user, ownedGames: games }))
})

app.get("/friend", ensureAuthenticated, async (req, res) => {
  res.sendFile(__dirname + '/client/friend.html')
})
app.get("/friendData", ensureAuthenticated, async (req, res) => {

  let userFriends = await prisma.Friends.findMany({
    where: {

      from: req.user.id

    }
  });
  let promises = [];
  userFriends.forEach(async element => {
    let temp = axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${element.to}`);
    promises.push(temp)
  });

  let serverResponse = []
  Promise.all(promises).then(result => {
    // console.log(result)
    result.forEach(element => {
      console.log(element.data)
      serverResponse.push(element.data)
    });
    res.send(JSON.stringify(serverResponse));
  })

})
app.post('/addFriend', ensureAuthenticated, urlencodedParser, async function (req, res) {

  // let savedData  = await prisma.Friends.create({
  //   data:{
  //     from : req.user.id,
  //     to : req.body.id
  //   }
  // })
  let friendReq = await prisma.FriendRequest.create({
    data: {
      from: req.user.id,
      to: req.body.id,
      status: 'pending'
    }
  })

  console.log(friendReq)

  res.sendStatus(200);
});

app.get('/getPendingRequest', ensureAuthenticated, async (req, res) => {
  let pendingReq = await prisma.FriendRequest.findMany({
    where: {
      status: 'pending',
      to: req.user.id
    }
  })

  let promises = [];
  pendingReq.forEach(async element => {
    let temp = axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${element.from}`);
    promises.push(temp)
  });

  let serverResponse = []
  Promise.all(promises).then(result => {
    // console.log(result)
    result.forEach(element => {
      console.log(element.data)
      serverResponse.push(element.data)
    });
    res.send(JSON.stringify(serverResponse));
  })



  // res.send(pendingReq)
})

app.post('/searchFriend', ensureAuthenticated, urlencodedParser, async function (req, res) {

  const searchresult = await prisma.User.findMany({
    where: {
      name: {
        contains: req.body.name,
      },
    },
    take: 2
  })
  console.log(searchresult)
  res.send(JSON.stringify(searchresult));
  //res.sendStatus(200);
});


app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.get("/pendingrequest", ensureAuthenticated, async (req, res) => {
  res.sendFile(__dirname + '/client/PendingRequest.html')
})
app.post("/acceptFriend", ensureAuthenticated, urlencodedParser, async (req, res) => {
  let friendReq = await prisma.FriendRequest.updateMany({
    where: {
      to: req.user.id,
      from: req.body.id
    },
    data: {

      status: 'accepted'
    }
  })
  let savedData = await prisma.Friends.create({
    data: {
      from: req.user.id,
      to: req.body.id

    }
  })
  let savedData1 = await prisma.Friends.create({
    data: {
      to: req.user.id,
      from: req.body.id
    }
  })

})
// GET /auth/steam
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Steam authentication will involve redirecting
//   the user to steamcommunity.com.  After authenticating, Steam will redirect the
//   user back to this application at /auth/steam/return
app.get('/auth/steam',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect(`http://localhost:4200/linked-accounts?steamid=${req.user.id}`);
  });

// GET /auth/steam/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect(`http://localhost:4200/linked-accounts?steamid=${req.user.id}`);
  });
app.get("/test",ensureAuthenticated, (req, res) => {
  res.sendStatus(200);
})


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  var admin = require("firebase-admin");

  var serviceAccount = require("./../../key/firebaseadminkey.json");
  if(!admin.apps.length){
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
  
    });
  }else{
    admin.app()
  }
  
  const { getAuth } = require("firebase-admin/auth")
  if(req.headers['authorization']==null){
    res.sendStatus(400);
    return;
  }
  let idToken = req.headers['authorization'].split(" ")[1]
 
  getAuth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken
      next();
      // console.log(decodedToken);
      // console.log(uid)
      // ...
    })
    .catch((error) => {
      // Handle error
      req.sendStatus(403)
      console.log(error)
    });

  // res.sendStatus(200)
}

// app.get('/chat', (req, res) => {
//   res.send('<h1>Hey Socket.io</h1>');
// });



io.on('connection', (socket) => {
  // socketIdMap.set(socket.id)
  console.log('a user connected' , socket.id);
  
  socket.on('setSocketId', (msg) => {
    console.log('setSocket id' , parseInt(msg.name), "====>"  , socket.id );
    socketIdMap.set(parseInt(msg.name), socket.id)
  });
  socket.on('disconnect', () => {
    console.log('user disconnected' );
  });
  
  socket.on('my message', (receivedData) => {
    console.log(receivedData)
    let receiver = receivedData.receiver ;
    let receivedSocketId = socketIdMap.get( receiver)
    console.log(socketIdMap)
    console.log("have to send to user " , receivedSocketId)
    io.to(receivedSocketId).emit('my broadcast' , receivedData.msg);
    // io.emit('my broadcast', `server: ${msg}`);
  });
}); 









let download = function(picurl , id ,res ,req) {
  const url = picurl;

  https.get(url, (response) => {
    const path2 =path.join ( __dirname , `./../../public/profilePicture/${id}.jpg`);
    const writeStream = fs.createWriteStream(path2);

    response.pipe(writeStream);

    writeStream.on("finish", () => {
        writeStream.close();
        console.log("Download Completed!");
        res.send(JSON.stringify({ user: req.user }))
    })
  })
}


app.listen(3000);
http.listen(5000, () => console.log(`Listening on port ${5000}`));

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect('/');
// }
