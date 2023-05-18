const express = require('express')
const router = express.Router()
const auth  = require('./../middleware/authMiddleware')
//this is to get all the comment under one post
router.get("/map", async (req, res) => {
    const url = 'https://public-api.tracker.gg/v2/csgo/standard/profile/steam/'+res.steamId+'/segments/map?TRN-Api-Key='+process.env.satsApiKey;

fetch(url)
  .then(response => response.json())
  .then(jsonData => res.send(jsonData));
})
router.get("/weapon", async (req, res) => {
    const url = 'https://public-api.tracker.gg/v2/csgo/standard/profile/steam/76561198843078725/segments/weapon?TRN-Api-Key='+process.env.satsApiKey;

fetch(url)
  .then(response => response.json())
  .then(jsonData => res.send(jsonData));
})
module.exports = router