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

let postHelper = require('./postHelper')
let profileHelper = require('./profileHelper')
var bodyParser = require('body-parser')
// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


const { PrismaClient } = require('@prisma/client');
const { response } = require("express");
const { json } = require("express");

const prisma = new PrismaClient()
const multer  = require('multer');
const socketRunner = require('./sockerRunner')
const { randomUUID } = require("crypto");
const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null,  path.join(__dirname + './../../public/profilePicture'))
  },
  filename: function (req, file, cb) {
    console.log(req.user)
    const uniqueSuffix = req.user.user_id
  cb(null,uniqueSuffix+'.'+ 'jpg')
  }
})
const bannerStr = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null,  path.join(__dirname + './../../public/profileBanner'))
  },
  filename: function (req, file, cb) {
    console.log(req.user)
    const uniqueSuffix = req.user.user_id
  cb(null,uniqueSuffix+'.'+ 'jpg')
  }
})

const uploadPostStorage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null,  path.join(__dirname + './../../public/post'))
  },
  filename: function (req, file, cb) {
    console.log(req.user)
    const uniqueSuffix = randomUUID()
  cb(null,uniqueSuffix+'.'+ 'jpg')
  }
})
const upload = multer({ storage: storage })
const uploadPost = multer({ storage: uploadPostStorage })
const bnUpload = multer({ storage: bannerStr })

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

const socketUserMap = new Map();
const userSocketMap = new Map();
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
app.use(bodyParser.json());
app.use('/static',express.static(__dirname + '/../../public'));

app.get('/saveuser', ensureAuthenticated , async function (req, res) {
 
  //console.log(req.user)
  const fetchUser = await prisma.user.findUnique({
    where: {
      id: req.user.user_id
    }
  })
  if (fetchUser == null) {
    // console.log("user not found ")

    const newUser = await prisma.user.create({
      data: {
        id: req.user.user_id,
        name: req.user.name,
        profilePicture:req.user.picture,
        profileBanner:'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg',
        gmailId:req.user.email,
        activeChoice:true,
        isConnected:true
      },
    })

    //download(req.user.picture , req.user.user_id  ,res , req)
    //postHelper.downProfilePic(req,res)
    console.log("new user created db updated", newUser)
  }else{
    console.log("user exists")
    res.send(JSON.stringify({status:"ok"}))
  }
 
});

app.post('/userNameUpdate',ensureAuthenticated,urlencodedParser,async (req, res)=>{
  console.log(req.body.name);
  const updateUserName=await prisma.User.update({
    where:{
      id:req.user.user_id
    },
    data:{
      name:req.body.name
    }
  })
  res.sendStatus(200);
});


app.get("/accountData", ensureAuthenticated,async (req, res) => {
  let steamIdfromDb = await prisma.User.findUnique({
    where: {
      id: req.user.user_id
    },
    select: {
      steamId: true
    }
  })
  if(steamIdfromDb.steamId!=null){
    const c = await axios.get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamIdfromDb.steamId}&include_appinfo=true&format=json`);
    let games = c.data.response.games;
    if (games == undefined || games == null) {
    games = []
  }
  res.send(JSON.stringify({ user: req.user, ownedGames: games }))
  }else{console.log("null caught")}
  
});

app.get("/friend", ensureAuthenticated, async (req, res) => {
  res.sendFile(__dirname + '/client/friend.html')
})

app.post("/isFriend", ensureAuthenticated, urlencodedParser, async (req, res) => {
  const isfrnd = await prisma.FriendRequest.findMany({
    where: {
      OR:[
        {
            sender: req.user.user_id,
            reciever:req.body.id
        },
        {
            reciever: req.user.user_id,
            sender:req.body.id
        }

      ]
    },select:{
      status:true,
    }
  })
  res.send(JSON.stringify(isfrnd));
})
app.get("/sentPending", ensureAuthenticated, async (req, res) => {
  const result = await prisma.FriendRequest.findMany({
    where: 
      {
        sender: req.user.user_id,
        status:"pending"    
      }
  })
  res.send(JSON.stringify(result));
})
app.get("/friendData", ensureAuthenticated, async (req, res) => {
  const result = await prisma.$queryRaw`select * from public."User" where id in (select reciever from public."Friends" where sender =${req.user.user_id})`
  // const jsonObject = req.body;
  // console.log(jsonObject)
  // let userFriends = await prisma.Friends.findMany({
  //   where: {

  //     from: req.user.user_id

  //   }
  // });
  // let promises = [];
  // userFriends.forEach(async element => {
  //   let temp = axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${element.to}`);
  //   promises.push(temp)
  // });

  // let serverResponse = []
  // Promise.all(promises).then(result => {
  //   // console.log(result)
  //   result.forEach(element => {
  //     console.log(element.data)
  //     serverResponse.push(element.data)
  //   });
  //   res.send(JSON.stringify(serverResponse));
  // })
 
  
  res.send(JSON.stringify(result));
})
//TODO:testing function for notification
app.post("/sendNoti",ensureAuthenticated,async (req,res)=>{
  // console.log(req.user.user_id);
  // console.log(req.body.receiver_id);
  socketRunner.sendNotification(io , userSocketMap,"poke",req.user.user_id,req.body.receiver_id)
  res.sendStatus(200);
});
app.post('/addFriend', ensureAuthenticated, urlencodedParser, async function (req, res) {
  const jsonObject = req.body;
  console.log(req.body.to)
  socketRunner.sendNotification(io , userSocketMap,"frnd req",req.user.user_id,jsonObject.to)
  // let savedData  = await prisma.Friends.create({
  //   data:{
  //     from : req.user.id,
  //     to : req.body.id
  //   }
  // })

  let friendReq = await prisma.FriendRequest.create({
    data: {
      sender: req.user.user_id,
      reciever: jsonObject.to,
      status: 'pending'
    }
  })
  
  //console.log(friendReq)
  res.sendStatus(200);
});

app.get('/getPendingRequest', ensureAuthenticated, async (req, res) => {
  // let pendingReq = await prisma.FriendRequest.findMany({
  //   where: {
  //     status: 'pending',
  //     reciever: req.user.user_id
  //   },
    const result = await prisma.$queryRaw`select * from public."User" where id in (select sender from public."FriendRequest" where reciever =${req.user.user_id} and status='pending')`
  // })
  // console.log(pendingReq)
  // let promises = [];
  // pendingReq.forEach(async element => {
  //   //let temp = axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${element.from}`);
  //   let temp=element.from;
  //   promises.push(temp)
  // });

  // let serverResponse = []
  // Promise.all(promises).then(result => {
  //   // console.log(result)
  //   result.forEach(element => {
  //     console.log(element.data)
  //     serverResponse.push(element.data)
  //   });
  //   res.send(JSON.stringify(serverResponse));
  // })
  res.send(result)
})

app.post('/searchFriend', ensureAuthenticated, urlencodedParser, async function (req, res) {
  const jsonObject = req.body;
  const searchresult = await prisma.User.findMany({
    where: {
      name: {
        contains: jsonObject.searchTerm,
        mode: 'insensitive',
      },
    }
  })
  //console.log("searchresults for"+jsonObject.searchTerm)
  //console.log(searchresult)
  res.send(JSON.stringify(searchresult));
  //res.sendStatus(200);
});


app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.post("/acceptFriend", ensureAuthenticated, urlencodedParser, async (req, res) => {
  const jsonObject = req.body;
  let friendReq = await prisma.FriendRequest.updateMany({
    where: {
      reciever: req.user.user_id,
      sender: jsonObject.frnd_id
    },
    data: {
      status: 'accepted'
    }
  })
  let savedData = await prisma.Friends.create({
    data: {
      sender: req.user.user_id,
      reciever: jsonObject.frnd_id
    }
  })
  let savedData1 = await prisma.Friends.create({
    data: {
      reciever: req.user.user_id,
      sender: jsonObject.frnd_id
    }
  })
  res.sendStatus(200);
})
app.post("/rejectFriend", ensureAuthenticated, urlencodedParser, async (req, res) => {
  const jsonObject = req.body;
  let friendReq = await prisma.FriendRequest.updateMany({
    where: {
      reciever: req.user.user_id,
      sender: jsonObject.frnd_id
    },
    data: {
      status: 'rejected'
    }
  })
 
  res.sendStatus(200);
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
app.get('/auth/steam/return',passport.authenticate('steam', { failureRedirect: '/' }), function (req, res) {
  
  res.redirect(`http://localhost:4200/linked-accounts?steamid=${req.user.id}`);  
  });
app.get("/test",ensureAuthenticated, (req, res) => {
  res.sendStatus(200);
})

app.get("/steamUserInfo", ensureAuthenticated,async (req, res) => {
  console.log("here")
  
  let steamIdfromDb = await prisma.User.findUnique({
    where: {
      id: req.user.user_id
    },
    select: {
      steamId: true
    }
  })
  console.log(steamIdfromDb)
  if(steamIdfromDb.steamId!=null){
    const c = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamIdfromDb.steamId}`);
    let players= c.data.response.players;
    if (players == undefined || players == null) {
    players = []
    }
    
    res.send(JSON.stringify({ info: players }))
  }else{console.log("null caught")}
});

app.post('/steamInfo',ensureAuthenticated, urlencodedParser,async(req,res)=>{
  if(req.body.steam_id!=null){
    const c = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${req.body.steam_id}`);
    let players= c.data.response.players;
    if (players == undefined || players == null) {
    players = []
    }
    res.send(JSON.stringify({ info: players }))
  }else{
    console.log("null caught")
    res.sendStatus(200)} 
});

app.get('/activeState',ensureAuthenticated,async(req,res)=>{
  let activeStateData = await prisma.User.findMany({
    where: {
      id: req.user.user_id
    },
    select: {
      activeChoice: true
    }
  })
  //console.log(activeStateData)
  res.send(JSON.stringify(activeStateData));
});

app.post('/activeStateChange',ensureAuthenticated, urlencodedParser,async(req,res)=>{
  const jsonObject = req.body;
  const updateUser = await prisma.User.update({
    where: {
      id: req.user.user_id,
    },
    data: {
      activeChoice: jsonObject.state,
    },
  })
  const friendlist = await prisma.$queryRaw`select reciever from public."Friends" where sender =${req.user.user_id}`
  //console.log(friendlist)
  friendlist.forEach(frnd => {
    if(jsonObject.state){
      socketRunner.sendNotification(io , userSocketMap,"online",req.user.user_id,frnd.reciever)
    }else{
      socketRunner.sendNotification(io , userSocketMap,"disc",req.user.user_id,frnd.reciever)
    }
  });
});

app.post('/setSteamId',ensureAuthenticated, urlencodedParser,async(req,res)=>{
  const jsonObject = req.body;
  let steamIdData = await prisma.User.findMany({
    where: {
      steamId: jsonObject.acc_id
    },
    select:{
      id:true
    }
  });
  
  
  if(steamIdData[0]==null){
  const updateUser = await prisma.User.update({
    where: {
      id: req.user.user_id,
    },
    data: {
      steamId: jsonObject.acc_id,
    },
  })
  res.status(200).send({ message: 'New SteamId Linked'});
  }else{
    console.log("already linked")
    res.status(200).send({ message: 'This Steam Id is already linked with another existing account' });
  }
});

app.get('/getSteamId',ensureAuthenticated,async(req,res)=>{
  let steamIdData = await prisma.User.findMany({
    where: {
      id: req.user.user_id
    }
  })
  res.send(JSON.stringify(steamIdData));
});

app.post('/deleteSteamId',ensureAuthenticated, urlencodedParser,async(req,res)=>{
  
  const updateUser = await prisma.User.update({
    where: {
      id: req.user.user_id,
    },
    data: {
      steamId: null,
    },
  })
});

app.get('/chatData',ensureAuthenticated, async (req, res) => {
  let fetchedChat = await prisma.Chat.findMany({
    where:{
      OR:[
        {
          sender: req.user.uid,
          receiver: req.query.friendId
        },
        {
          sender: req.query.friendId,
          receiver: req.user.uid
        }
      ]
    }
  })
  res.send(JSON.stringify(fetchedChat))
});

app.get('/getActiveList',ensureAuthenticated, async (req, res) => {
  let fetchedChat = await prisma.Chat.findMany({
    where:{
          receiver: req.user.uid,    
    },select:{
      sender:true,
    }
  })
  res.send(JSON.stringify(fetchedChat))
});


app.get('/sentOnly',ensureAuthenticated, async (req, res) => {
  let fetchedChat = await prisma.Chat.findMany({
    where:{
          sender: req.user.uid,
    }
  })
  res.send(JSON.stringify(fetchedChat))
});


app.post('/gameSelect',ensureAuthenticated, urlencodedParser,async(req,res)=>{
  const jsonObject = req.body;
  const selectedGames = await prisma.GameSelectInfo.create({
    data: {
      uid: req.user.user_id,
      appid: jsonObject.appid,
    }
  })
  res.sendStatus(200);
});


app.get('/getSelectedGames',ensureAuthenticated,async(req,res)=>{
  let selectedGamedata = await prisma.GameSelectInfo.findMany({
    where: {
      uid: req.user.user_id
    },
    select: {
      appid: true
    }
  })
  res.send(JSON.stringify(selectedGamedata));
});


app.post('/selectedDelete',ensureAuthenticated, urlencodedParser,async(req,res)=>{
  const jsonObject = req.body;
  let {affectedrows} = await prisma.GameSelectInfo.deleteMany({
    where: {
      uid: req.user.user_id
    }
  })
  console.log(affectedrows)
  res.sendStatus(200);
});
app.post('/getFrndSelectedGames',ensureAuthenticated,async(req,res)=>{
  const jsonObject = req.body;
  
  let selectedGamedata = await prisma.GameSelectInfo.findMany({
    where: {
      uid: jsonObject.frnd_id
    },
    select: {
      appid: true
    }
  })
  res.send(JSON.stringify(selectedGamedata));
});
app.post('/getUserInfo',ensureAuthenticated,async(req,res)=>{
  const jsonObject = req.body;
  //console.log(jsonObject.frnd_id)
  let userData = await prisma.User.findUnique({
    where: {
      id: jsonObject.frnd_id
    }
  })
  res.send(JSON.stringify(userData));
});

app.post('/saveOwnedgames',ensureAuthenticated,async(req,res)=>{
  const fetchUser = await prisma.OwnedGames.findUnique({
    where: {
      uid: req.user.user_id
    }
  })
  
  if(fetchUser==null){
  const savegame = await prisma.OwnedGames.create({
    data: {
      uid: req.user.user_id,
      games:JSON.stringify(req.body.data)
    }
  });
  }else{
    const savegame = await prisma.OwnedGames.update({
      where:{
        uid: req.user.user_id,
      },
      data: {
        games:JSON.stringify(req.body.data)
      }
    });
  }
  res.sendStatus(200);
});

app.get('/getOwnedgames',ensureAuthenticated, async (req, res) => {
  let fetchedGames = await prisma.OwnedGames.findMany({
    where:{
      uid:req.user.user_id
    },
    select:{
      games:true,
    }
  })
  res.send(JSON.stringify(fetchedGames))
});

app.post('/getFrndOwnedgames',ensureAuthenticated, async (req, res) => {
  const jsonObject = req.body;
  let fetchedGames = await prisma.OwnedGames.findMany({
    where:{
      uid:jsonObject.frnd_id
    },
    select:{
      games:true,
    }
  })
  res.send(JSON.stringify(fetchedGames))
});


app.get('/getPost',ensureAuthenticated, (req,res)=>postHelper.getPost(req,res,prisma))

app.post('/createPost' , ensureAuthenticated, uploadPost.array('post',10) , urlencodedParser,(req,res)=>postHelper.createPost(req,res,prisma))

app.get('/likePost' , ensureAuthenticated ,(req,res)=>postHelper.likePost(req,res, prisma))

app.get('/getOwnPost',ensureAuthenticated, (req,res)=>postHelper.getOwnPost(req,res, prisma))

app.get('/getpostbytagname' ,(req,res)=>postHelper.getPostByTags(req,res,prisma))

app.post("/uploadProfile", ensureAuthenticated, upload.single('avatar'), (req, res) => {
  profileHelper.upProfilePic(req, res, prisma);
  res.sendStatus(200);
});

app.post("/uploadBanner",ensureAuthenticated, bnUpload.single('banner'),(req,res)=>{
  profileHelper.upBanner(req, res, prisma);
  res.sendStatus(200);
});

app.post("/updateBio",ensureAuthenticated,async (req,res)=>{
  const updateStatus = await prisma.user.update({
    where: {
      id: req.user.user_id,
    },
    data: {
      bio: req.body.bio,
    },
  })
  res.sendStatus(200);
});



socketRunner.execute(io , socketUserMap ,  userSocketMap)



//profilePic download
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
    
        console.log(error)
        res.sendStatus(403)
      
    });
    
  // res.sendStatus(200)
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
