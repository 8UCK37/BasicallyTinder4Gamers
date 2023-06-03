const express = require('express')
const router = express.Router()
const auth  = require('./../middleware/authMiddleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const { HttpStatusCode } = require('axios');
const ensureAuthenticated = auth.ensureAuthenticated
const axios = require("axios")

router.get("/mapAndWeaponDataFromSteamId", ensureAuthenticated, async (req, res) => {
  let steamIdfromDb = await prisma.User.findUnique({
    where: {
      id: req.user.user_id
    },
    select: {
      steamId: true
    }
  })
  if (steamIdfromDb.steamId != null) {
    const urlStats = await axios.get(`https://public-api.tracker.gg/v2/csgo/standard/profile/steam/${steamIdfromDb.steamId}`);
    const urlWeapon = await axios.get(`https://public-api.tracker.gg/v2/csgo/standard/profile/steam/${steamIdfromDb.steamId}/segments/weapon?TRN-Api-Key=${process.env.satsApiKey}`);
    
    console.log("kichuakta",urlStats.data.data)
    res.send(JSON.stringify({playerStats:urlStats.data.data,weaponStats:urlWeapon.data.data}))
  } else { console.log("null caught") 
  res.sendStatus(404);
}
});

module.exports = router