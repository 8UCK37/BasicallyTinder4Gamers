const axios = require("axios");
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('./../middleware/authMiddleware');
const ensureAuthenticated = auth.ensureAuthenticated;
const { spawn } = require('child_process');

router.post("/getValoStatByIGN", ensureAuthenticated, async (req, res) => {
  console.log('valo id:', req.body.ign);
  const name = req.body.ign.split('#')[0];
  const nId = req.body.ign.split('#')[1];
  console.log('name', name);
  console.log('nId', nId);

  try {
    const childPython = spawn('python', ['./../TeamFinder/examples/signon/routes/valo_stats.py', name, nId]);

    let result = '';
    childPython.stdout.on('data', (data) => {
      result += data.toString();
    });

    childPython.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    childPython.on('close', async (code) => {
      console.log(`childPython exited with code: ${code}`);
      try {
        const playerData = JSON.parse(result);

        console.log(JSON.parse(JSON.stringify(playerData)))
        let setValoStats = await prisma.UserGameStats.upsert({
          where: {
            userId: req.user.user_id
          },
          update:{
            valoStats: playerData
          },
          create:{
            userId:req.user.user_id,
            valoStats: playerData,
          }
        })
        res.send(playerData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        res.sendStatus(500);
      }
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
