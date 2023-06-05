const axios = require("axios")
const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const auth  = require('./../middleware/authMiddleware')
const ensureAuthenticated = auth.ensureAuthenticated

router.post("/getValoStatByIGN",ensureAuthenticated, async (req, res)=> {
    console.log('valo id:',req.body.ign);
    const name=req.body.ign.split('#')[0]
    const nId=req.body.ign.split('#')[1]
    console.log('name',name)
    console.log('nId',nId)
    try{
        //let valostats = await axios.get(`https://api.tracker.gg/api/v2/valorant/standard/profile/riot/CaRNaGePero%2369420?`);
        
    }catch(error){
        console.log(error)
        
    }
    res.sendStatus(200)
})

module.exports = router