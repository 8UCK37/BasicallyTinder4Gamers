/**
 * Basic example demonstrating passport-steam usage within Express framework
 adding space
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
const multer = require('multer');
const socketRunner = require('./sockerRunner')
const { randomUUID } = require("crypto");
const auth  = require('./middleware/authMiddleware')
const ensureAuthenticated = auth.ensureAuthenticated
const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname + './../../public/profilePicture'))
  },
  filename: function (req, file, cb) {
    console.log(req.user)
    const uniqueSuffix = req.user.user_id
    cb(null, uniqueSuffix + '.' + 'jpg')
  }
})
const bannerStr = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname + './../../public/profileBanner'))
  },
  filename: function (req, file, cb) {
    console.log(req.user)
    const uniqueSuffix = req.user.user_id
    cb(null, uniqueSuffix + '.' + 'jpg')
  }
})

const uploadPostStorage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname + './../../public/post'))
  },
  filename: function (req, file, cb) {
    console.log(req.user)
    const uniqueSuffix = randomUUID()
    cb(null, uniqueSuffix + '.' + 'jpg')
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


const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:4200']
  }
});

const socketUserMap = new Map();
const userSocketMap = new Map();
const sessionMap = new Map()


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
app.use('/static', express.static(__dirname + '/../../public'));

//routers

app.use("/comment", require('./routes/comment'))
//saves a new user #endpoint
app.post('/saveuser', ensureAuthenticated, async function (req, res) {
  console.log("/saveuser called")
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
        profilePicture: req.user.picture,
        profileBanner: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg',
        gmailId: req.user.email,
        activeChoice: true,
        isConnected: true
      },
    })

    console.log("new user created db updated", newUser)
    // res.statusCode = 201
    res.send(JSON.stringify(newUser))
  } else {
    console.log("user exists")
    // res.statusCode(200)
    res.send(JSON.stringify(fetchUser))
  }

});
//returns user info #endpoint
app.post('/getUserInfo', ensureAuthenticated, async (req, res) => {
    //console.log("/getUserInfo called",req.body)
    try{
      let userData = await prisma.User.findUnique({
        where: {
          id: req.body.id
        },
        include: {
          userInfo:true
        }
      })
      console.log(userData)
      res.send(JSON.stringify(userData));
    }
    catch(e){
      console.log(e)
      res.sendStatus(400)
    }
});

app.put('/updateUserInfo', ensureAuthenticated, async (req, res) => {
  //console.log("/getUserInfo called",req.body)
  try{
    let userData = await prisma.UserInfo.update({
      where: {
        id: req.user.user_id
      },
      data: {
        userInfo:true
      }
    })
    console.log(userData)
    res.send(JSON.stringify(userData));
  }
  catch(e){
    console.log(e)
    res.sendStatus(400)
  }
});

app.post("/saveUserInfo" , ensureAuthenticated , async (req , res)=>{

 let userData = await prisma.User.update({
  where:{
    id: req.user.user_id
  },
  data:{
    userInfo:{
      create:req.body  
      
      
    }
    
  },
  include: { userInfo: true }
 })
  res.sendStatus(200)
})
//updates displayname of the user #endpoint
app.post('/userNameUpdate', ensureAuthenticated, urlencodedParser, async (req, res) => {
  console.log(req.body.name);
  const updateUserName = await prisma.User.update({
    where: {
      id: req.user.user_id
    },
    data: {
      name: req.body.name
    }
  })
  res.sendStatus(200);
});



//tocheck if a person is you friend or not #endpoint
app.post("/isFriend", ensureAuthenticated, urlencodedParser, async (req, res) => {
  const isfrnd = await prisma.FriendRequest.findMany({
    where: {
      OR: [
        {
          sender: req.user.user_id,
          reciever: req.body.id
        },
        {
          reciever: req.user.user_id,
          sender: req.body.id
        }
      ]
    }, select: {
      status: true,
    }
  })
  if (isfrnd.length != 0) {
    if (isfrnd[0].status == 'accepted') {
      res.send('accepted');
    }
    else if (isfrnd[0].status == 'rejected') {
      res.send('rejected');
    }
    else if (isfrnd[0].status == 'pending') {
      res.send('pending');
    }
  } else {
    res.send('no engagement')
  }
})
//returns your friends #endpoint
app.get("/friendData", ensureAuthenticated, async (req, res) => {
  const result = await prisma.$queryRaw`select * from public."User" where id in (select reciever from public."Friends" where sender =${req.user.user_id})`

  res.send(JSON.stringify(result));
})
//returns the friends of your friends #endpoint
app.post("/friendsoffriendData", ensureAuthenticated, async (req, res) => {
  const result = await prisma.$queryRaw`select * from public."User" where id in (select reciever from public."Friends" where sender =${req.body.frnd_id})`
  res.send(result);
})
//TODO:testing function for notification #endpoint
app.post("/sendNoti", ensureAuthenticated, async (req, res) => {
  // console.log(req.user.user_id);
  // console.log(req.body.receiver_id);
  socketRunner.sendNotification(io, userSocketMap, "poke", req.user.user_id, req.body.receiver_id)
  res.sendStatus(200);
});

//sends a friend request #endpoint
app.post('/addFriend', ensureAuthenticated, urlencodedParser, async function (req, res) {
  const jsonObject = req.body;
  console.log(req.body.to)
  socketRunner.sendNotification(io, userSocketMap, "frnd req", req.user.user_id, jsonObject.to)

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

//does exactly what the freindata does but a lot better in futre may replace friendata #endpoint
app.get('/getFriendData', ensureAuthenticated, async (req, res) => {
  const user_id = req.user.user_id;
  const result = await prisma.$queryRaw`SELECT u.*, 
        CASE
        WHEN fr.status = 'pending' AND fr.sender = ${user_id} THEN 'outgoing'
            WHEN fr.status = 'pending' AND fr.reciever = ${user_id} THEN 'incoming'
                WHEN fr.status = 'accepted' THEN 'accepted'
                    ELSE 'unknown'
                END AS status
              FROM public."User" u
            INNER JOIN public."FriendRequest" fr
            ON (u.id = fr.sender AND fr.reciever = ${user_id})
            OR (u.id = fr.reciever AND fr.sender = ${user_id})`;
  res.send(result);
});

//searches the user table for names #endpoint
app.post('/searchFriend', ensureAuthenticated, urlencodedParser, async function (req, res) {
  const jsonObject = req.body;

  if(req.body.searchTerm=='noob'){
    
    const searchresult = await prisma.User.findMany({
      where: {
        id:'Cc6YM87NvihVFGpgbAclZqRLpP13'
      }
    })
  res.send(JSON.stringify(searchresult));
  }else{
    
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
  res.send(JSON.stringify(searchresult));}
  //res.sendStatus(200);
});

//selfexplanatory #endpoint
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

//accepts a friend req #endpoint
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
  socketRunner.sendNotification(io, userSocketMap, "frndReqAcc", req.user.user_id, jsonObject.frnd_id)
  res.sendStatus(200);
})
//rejects a friend req #endpoint
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

//new twitch login we just need to implement methods to get the live status 
app.get('/auth/twitch', (req, res) => {
  //console.log(req.sessionID)
  sessionMap.set(req.sessionID , req.query.uid);
  //console.log(sessionMap)
  const baseUrl = 'https://id.twitch.tv/oauth2/authorize';
  const clientId = "5q5a2eqsg77c8nf2xoxohxrfeniskg";
  const redirectUri = 'http://localhost:3000/auth/twitch/callback';
  const scopes = 'user_read'; // the scopes you need for your application
  const twitchAuthUrl = `${baseUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}`;
  res.redirect(twitchAuthUrl);
});

app.get('/auth/twitch/callback', async (req, res) => {
  const clientId = "5q5a2eqsg77c8nf2xoxohxrfeniskg";
  const clientSecret = "zqqlb0mcih38gw1hn208gydw31jzis";
  const redirectUri = 'http://localhost:3000/auth/twitch/callback';
  const code = req.query.code;
  const tokenUrl = 'https://id.twitch.tv/oauth2/token';
  const tokenParams = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  });
  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams,
    });
    const json = await response.json();
    const accessToken = json.access_token;
    const refreshToken = json.refresh_token;
    //console.log(accessToken)
    //console.log(refreshToken)
    setTwitchToken(req,res,accessToken,refreshToken)
    // use the access token to get the user's Twitch account information
    //res.send(accessToken);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to get access token');
  }
});


//updates the twitchtoken of a user to the user table 
async function setTwitchToken(req, res,token,refreshToken) {
  //console.log('setTwitchToken called')
  //console.log(sessionMap)
  //console.log(token)
  //console.log(refreshToken)
  let twitchTokenData = await prisma.User.findMany({
    where: {
      id: sessionMap.get(req.sessionID)
    },
    select: {
      twitchtoken: true
    }
  });
  //console.log(twitchTokenData)

  if (twitchTokenData[0] != null) {
    const updateUser = await prisma.User.update({
      where: {
        id: sessionMap.get(req.sessionID),
      },
      data: {
        twitchtoken: {token:token,refreshToken:refreshToken},
      },
    })
    //res.status(200).send({ message: 'Twitch Linked Successfully' });
  } else {
    const updateUser = await prisma.User.create({
      where: {
        id: sessionMap.get(req.sessionID),
      },
      data: {
        twitchtoken: token,
      },
    })
  }
  res.redirect("http://localhost:4200/profile-page/linked-accounts");
}


app.get('/getowntwitchinfo',ensureAuthenticated ,async (req, res) => {
  let tokenFromDb = await prisma.User.findUnique({
    where: {
      id: req.user.user_id
    },
    select: {
      twitchtoken: true
    }
  })
  //console.log(tokenFromDb.twitchtoken.token)
  if(tokenFromDb.twitchtoken!=null){
  const accessToken = tokenFromDb.twitchtoken.token;
  const refreshToken = tokenFromDb.twitchtoken.refreshToken
  const userUrl = 'https://api.twitch.tv/helix/users';
  try {
    const response = await fetch(userUrl, {
      headers: {
        'Client-ID': "5q5a2eqsg77c8nf2xoxohxrfeniskg",
        'Authorization': `Bearer ${accessToken}`,
      },
    });
      if (response.ok) {
        const json = await response.json();
        const user = json.data[0];
        res.send(user);
        return;
      } else if (response.status === 401) {
        // Access token is expired, trying to refresh it
        const newToken = await refreshTwitchToken(req.user.user_id,refreshToken);
        //console.log(newToken)
        const response = await fetch(userUrl, {
          headers: {
            'Client-ID': "5q5a2eqsg77c8nf2xoxohxrfeniskg",
            'Authorization': `Bearer ${newToken.access_token}`,
          },
          
        });
        const json = await response.json();
        const user = json.data[0];
        res.send(user);
        return;
        }
       
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to get twitch profile information');
  }
}else{
  res.status(200).send('not logged in');
}
});

async function refreshTwitchToken(userid,refreshToken) {
  //console.log('refresh twitch')
  //console.log(userid)
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Client-ID': '5q5a2eqsg77c8nf2xoxohxrfeniskg',
      'Authorization': 'Bearer ' + refreshToken
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: '5q5a2eqsg77c8nf2xoxohxrfeniskg',
      client_secret: 'zqqlb0mcih38gw1hn208gydw31jzis'
    })
  };

  try {
    const response = await fetch('https://id.twitch.tv/oauth2/token', requestOptions);
    const json = await response.json();
    const accessToken = json.access_token;
    const refreshToken =json.refresh_token;
    console.log('New access token:', json);
    // Saving the new access token to the database
    if (json != null) {
      const updateUser = await prisma.User.update({
        where: {
          id: userid,
        },
        data: {
          twitchtoken: {token:accessToken,refreshToken:refreshToken},
        },
      })
    }
    return json; 
  } catch (error) {
    console.error(error);
  }
}


// GET /auth/steam
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Steam authentication will involve redirecting
//   the user to steamcommunity.com.  After authenticating, Steam will redirect the
//   user back to this application at /auth/steam/return
// GET /auth/steam/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.

passport.use(new SteamStrategy({
  returnURL: `http://localhost:3000/auth/steam/return`,
  realm: 'http://localhost:3000/',
  apiKey: apiKey
},
  function ( identifier, profile, done) {
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


//TODO implement sessions 
app.get('/auth/steam', (req, res ,next) =>{
  console.log(req.sessionID)
  sessionMap.set(req.sessionID , req.query.uid);
  // req.user_uid = req.query.uid
  // req.headers['someHeader'] = 'someValue'
  passport.authenticate('steam' ,  { failureRedirect: '/' } )(req,res,next);
  // res.redirect(`http://localhost:4200/linked-accounts?steamid=${req.user.id}`);
});

app.get('/auth/steam/return', passport.authenticate('steam', { failureRedirect: '/' }), async function (req, res) {
  setSteamId(req,res)
  // res.redirect(`http://localhost:4200/profile-page/linked-accounts?steamid=${req.user.id}`);
});

//updates the steamid of a user to the user table 
async function setSteamId(req, res) {
  const jsonObject = req.body;
  console.log(sessionMap , req.user  )
  let steam_id = req.user._json.steamid
  console.log("steamId :",req.user._json.steamid)
  let steamIdData = await prisma.User.findMany({
    where: {
      steamId: steam_id
    },
    select: {
      id: true
    }
  });


  if (steamIdData[0] == null) {
    const updateUser = await prisma.User.update({
      where: {
        id: sessionMap.get(req.sessionID),
      },
      data: {
        steamId: steam_id,
      },
    })
    // res.status(200).send({ message: 'New SteamId Linked' });
  } else {
    console.log("already linked")
    // res.status(200).send({ message: 'This Steam Id is already linked with another existing account' });
  }
  res.redirect("http://localhost:4200/profile-page/linked-accounts?status=linked");
}
//returns steamaccount data #endpoint
app.get("/steamUserInfo", ensureAuthenticated, async (req, res) => {
  
  let steamIdfromDb = await prisma.User.findUnique({
    where: {
      id: req.user.user_id
    },
    select: {
      steamId: true
    }
  })
  //console.log(steamIdfromDb)
  if (steamIdfromDb.steamId != null) {
    const c = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamIdfromDb.steamId}`);
    let players = c.data.response.players;
    if (players == undefined || players == null) {
      players = []
    }
    res.send(JSON.stringify({ info: players }))
  } else { console.log("null caught") }
});

//returns ownedgames of the user from Steam #endpoint
app.get("/accountData", ensureAuthenticated, async (req, res) => {
  let steamIdfromDb = await prisma.User.findUnique({
    where: {
      id: req.user.user_id
    },
    select: {
      steamId: true
    }
  })
  if (steamIdfromDb.steamId != null) {
    const c = await axios.get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamIdfromDb.steamId}&include_appinfo=true&format=json`);
    let games = c.data.response.games;
    if (games == undefined || games == null) {
      games = []
    }
    res.send(JSON.stringify({ user: req.user, ownedGames: games }))
  } else { console.log("null caught") }

});

//returns steam account data for anybody #endpoint
app.post('/steamInfo', ensureAuthenticated, urlencodedParser, async (req, res) => {
  //console.log(req.body.steam_id)
  if (req.body.steam_id != null) {
    const c = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${req.body.steam_id}`);
    let players = c.data.response.players;
    if (players == undefined || players == null) {
      players = []
    }
    res.send(JSON.stringify({ info: players }))
  } else {
    console.log("null caught")
    res.sendStatus(200)
  }
});


//returns the offline/pnline choice from the user table #endpoint
app.get('/activeState', ensureAuthenticated, async (req, res) => {
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

//updates the user'c choice of active state in the user table #endpoint
app.post('/activeStateChange', ensureAuthenticated, urlencodedParser, async (req, res) => {
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
    if (jsonObject.state) {
      socketRunner.sendNotification(io, userSocketMap, "online", req.user.user_id, frnd.reciever)
    } else {
      socketRunner.sendNotification(io, userSocketMap, "disc", req.user.user_id, frnd.reciever)
    }
  });
});


//TODO:returns the steamId from user table for linked accounts comp #endpoint
app.get('/getSteamId', ensureAuthenticated, async (req, res) => {
  let steamIdData = await prisma.User.findMany({
    where: {
      id: req.user.user_id
    }
  })
  res.send(JSON.stringify(steamIdData));
});
//nt used,deleted steam id from the uesr table #endpoint
app.post('/deleteSteamId', ensureAuthenticated, urlencodedParser, async (req, res) => {

  const updateUser = await prisma.User.update({
    where: {
      id: req.user.user_id,
    },
    data: {
      steamId: null,
    },
  })
});


//returns chats i.e texts #endpoint
app.get('/chatData', ensureAuthenticated, async (req, res) => {
  let fetchedChat = await prisma.Chat.findMany({
    where: {
      OR: [
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

//returns active conversations #endpoint
app.get('/getChats', ensureAuthenticated, async (req, res) => {
  const fetchedChat = await prisma.$queryRaw`
    SELECT 'sent' as chat_type, c.sender, c.receiver, u.*
    FROM public."Chat" c
    JOIN public."User" u ON u.id = c.receiver
    WHERE c.sender = ${req.user.uid}
    UNION
    SELECT 'received' as chat_type, c.sender, c.receiver, u.*
    FROM public."Chat" c
    JOIN public."User" u ON u.id = c.sender
    WHERE c.receiver = ${req.user.uid}
  `
  res.send(JSON.stringify(fetchedChat))
});

//updates the selected games table #endpoint
app.post('/gameSelect', ensureAuthenticated, urlencodedParser, async (req, res) => {
  let dataPresent = await prisma.GameSelectInfo.findMany({
    where: {
      uid: req.user.user_id
    },
    select: {
      appid: true
    }
  })
  if(dataPresent.length!=0){
    const updateselectedGames = await prisma.GameSelectInfo.updateMany({
      where:{
        uid: req.user.user_id,
      },
      data: {
        appid: req.body.appid,
      }
    })

  }else{
  const createselectedGames = await prisma.GameSelectInfo.create({
    data: {
      uid: req.user.user_id,
      appid: req.body.appid,
    }
  })
  }
  res.sendStatus(200);
});

//returns a user's showcases #endpoint
app.get('/getSelectedGames', ensureAuthenticated, async (req, res) => {
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


//returns your frined's game showcase #endpoint
app.post('/getFrndSelectedGames', ensureAuthenticated, async (req, res) => {
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

//saves your own owned games into ownedgames table #endpoint
app.post('/saveOwnedgames', ensureAuthenticated, async (req, res) => {
  const fetchUser = await prisma.OwnedGames.findUnique({
    where: {
      uid: req.user.user_id
    }
  })

  if (fetchUser == null) {
    const savegame = await prisma.OwnedGames.create({
      data: {
        uid: req.user.user_id,
        games: JSON.stringify(req.body.data)
      }
    });
  } else {
    const savegame = await prisma.OwnedGames.update({
      where: {
        uid: req.user.user_id,
      },
      data: {
        games: JSON.stringify(req.body.data)
      }
    });
  }
  res.sendStatus(200);
});
//returns the owned games from ownedgames table #endpoint
app.get('/getOwnedgames', ensureAuthenticated, async (req, res) => {
  let fetchedGames = await prisma.OwnedGames.findMany({
    where: {
      uid: req.user.user_id
    },
    select: {
      games: true,
    }
  })
  res.send(JSON.stringify(fetchedGames))
});
//#endpoint
app.post('/getFrndOwnedgames', ensureAuthenticated, async (req, res) => {
  const jsonObject = req.body;
  let fetchedGames = await prisma.OwnedGames.findMany({
    where: {
      uid: jsonObject.frnd_id
    },
    select: {
      games: true,
    }
  })
  res.send(JSON.stringify(fetchedGames))
});

//#endpoint
app.get('/getPost', ensureAuthenticated, (req, res) => postHelper.getPost(req, res, prisma))
//#endpoint
app.post('/createPost', ensureAuthenticated, uploadPost.array('post', 10), urlencodedParser, (req, res) => postHelper.createPost(req, res, prisma))
//#endpoint
app.post('/likePost', ensureAuthenticated, (req, res) => postHelper.likePost(req, res, prisma))
//#endpoint
app.post('/dislikePost', ensureAuthenticated, (req, res) => postHelper.dislikePost(req, res, prisma))
//#endpoint
app.post('/deletePost', ensureAuthenticated, (req, res) => postHelper.deletePost(req, res, prisma))
//#endpoint
app.post('/getPostById', ensureAuthenticated, (req, res) => postHelper.getPostById(req, res, prisma))
//#endpoint
app.post('/getLatestPost', ensureAuthenticated, (req, res) => postHelper.getLatestPost(req, res, prisma))
//#endpoint
app.post('/getpostbytagname',ensureAuthenticated, (req, res) => postHelper.getPostByTags(req, res, prisma))
//#endpoint
app.post("/uploadProfile", ensureAuthenticated, upload.single('avatar'), (req, res) => {
  profileHelper.upProfilePic(req, res, prisma);
  res.sendStatus(200);
});
//#endpoint
app.post("/uploadBanner", ensureAuthenticated, bnUpload.single('banner'), (req, res) => {
  profileHelper.upBanner(req, res, prisma);
  res.sendStatus(200);
});
//#endpoint
app.post("/updateBio", ensureAuthenticated, async (req, res) => {
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


socketRunner.execute(io, socketUserMap, userSocketMap)



// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.


app.listen(3000);
http.listen(5000, () => console.log(`Listening on port ${5000}`));


