/**
 * Basic example demonstrating passport-steam usage within Express framework
 */
const axios = require("axios")


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

var app = express();

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

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
app.use(express.static(__dirname + '/../../public'));

app.get('/', async function (req, res) {
  if (req.user) {
    const fetchUser = await prisma.user.findUnique({
      where: {
        id: req.user.id
      }
    })
    if (fetchUser == null) {
      console.log("user not found ")
      
      const newUser = await prisma.User.create({
        data: {
          id: req.user.id,
          name : req.user.displayName
        },
      })
      console.log("new user created" , newUser)
    }

  }

  res.render('index', { user: req.user });
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

app.get("/friend" , ensureAuthenticated, async (req, res) => {
  res.sendFile(__dirname + '/client/friend.html')
})
app.get("/friendData" ,ensureAuthenticated ,  async (req,res)=>{

  let userFriends= await prisma.Friends.findMany({
    where:{
      from : req.user.id 
    }
  });
  let promises = [];
  userFriends.forEach(async element => {
    let temp  =  axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${element.to}`);
    promises.push(temp)
  });
  
  let serverResponse = []
  Promise.all(promises).then(result=>{
    // console.log(result)
    result.forEach(element => {
      console.log(element.data)
      serverResponse.push(element.data)
    });
    res.send(JSON.stringify(serverResponse));
  })



  
})
app.post('/addFriend',ensureAuthenticated, urlencodedParser,async function (req, res) {
  
  // let savedData  = await prisma.Friends.create({
  //   data:{
  //     from : req.user.id,
  //     to : req.body.id
  //   }
  // })
  let friendReq = await prisma.FriendRequest.create({
    data:{
      from : req.user.id,
      to : req.body.id,
      status : 'pending'
    }
  })

  console.log(friendReq)
  console.log(savedData)
  res.sendStatus(200);
});

app.get('/getPendingRequest',ensureAuthenticated,async (req,res)=>{
  let pendingReq = await prisma.FriendRequest.findMany({
    where:{
      to: req.user.id
    }
  })

  let promises = [];
  pendingReq.forEach(async element => {
    let temp  =  axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${element.from}`);
    promises.push(temp)
  });
  
  let serverResponse = []
  Promise.all(promises).then(result=>{
    // console.log(result)
    result.forEach(element => {
      console.log(element.data)
      serverResponse.push(element.data)
    });
    res.send(JSON.stringify(serverResponse));
  })



  // res.send(pendingReq)
})

app.post('/searchFriend',ensureAuthenticated,urlencodedParser,async function (req, res) {
  
  const result = await prisma.User.findMany({
    where: { 
        name: {
          contains: req.body.name,
      },
    },
    take: 2
  })
  console.log(result)
  res.sendStatus(200);
});


app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.get("/pendingrequest" , ensureAuthenticated, async (req, res) => {
  res.sendFile(__dirname + '/client/PendingRequest.html')
})

// GET /auth/steam
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Steam authentication will involve redirecting
//   the user to steamcommunity.com.  After authenticating, Steam will redirect the
//   user back to this application at /auth/steam/return
app.get('/auth/steam',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/');
  });

// GET /auth/steam/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/');
  });

app.listen(3000);

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}
