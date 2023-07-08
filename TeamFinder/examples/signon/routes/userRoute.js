const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const auth  = require('./../middleware/authMiddleware')
const ensureAuthenticated = auth.ensureAuthenticated
const socketRunner = require('./../socketRunner')
//this is to get all the comment under one post

var log4js = require("log4js");
var logger = log4js.getLogger();
logger.level = "debug";


router.get("/friendSuggestion", ensureAuthenticated ,async (req, res) => {
    //logger.info('[userRoute:11] Calling /friendSuggestion => user' , req.user.uid )//annoying lol!

    let user = await prisma.$queryRaw`select u.id as userId, * from public."User" u inner join public."UserInfo" ui on u."userInfoId" = ui.id where u.id = ${req.user.uid}`
    //console.log(user) //annoying lol!
    let suggestedUser = await prisma.$queryRaw`select u.id as userId,* from public."User" u inner join public."UserInfo" ui on u."userInfoId" = ui.id where ui."Country" = ${user[0].Country} or ui."Language" = ${user[0].Language}`
    let suggestedUserAccordingGame = await prisma.$queryRaw`select  u.id as userId,*  from "User" u  inner join (select t1.* from ( select gsi .uid , regexp_split_to_table(gsi.appid , E',') AS games from public."GameSelectInfo" gsi ) t1 inner join  (select gsi.uid , regexp_split_to_table(gsi.appid , E',') AS games from public."GameSelectInfo" gsi where gsi.uid =${req.user.uid} ) t2 on t1.games=t2.games) t3 on u.id = t3.uid;`
    //logger.debug(suggestedUserAccordingGame)
    res.send(JSON.stringify({locationBased : suggestedUser , suggestedUserAccordingGame : suggestedUserAccordingGame}))
});


module.exports = router