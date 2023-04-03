const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const auth  = require('./../middleware/authMiddleware')
const ensureAuthenticated = auth.ensureAuthenticated
//this is to get all the comment under one post
router.get("/",ensureAuthenticated, async (req, res) => {
    
    let comments = await prisma.Posts.findMany({
        where:
        {
            id: parseInt(req.query.id)
        },
        include: {
            comments: {
              include: { author: true }
            }
          }
    })
    
    console.log(comments)
    res.send(comments)

})

// this is to create a new edge in comment tree 
// In req.body commentOf can be null or int
router.post("/add",ensureAuthenticated, async (req, res) => {
    console.log('comntpost',req.user.user_id)
    try {

        console.log(req.body)
        let edge = await prisma.Posts.update({
            where: {
                id: req.body.postId
            },
            data: {
                comments: {
                    
                    create: {
                        author:{
                            connect:{id:req.user.user_id}
                        },
                        commentStr: req.body.msg,
                        commentOf: req.body.commentOf
                    }
                }


            }
        })
        res.send(edge)
    }
    catch (e) {
        console.log(e)
        res.send(JSON.stringify({ status: "someting went wrong" }))
    }

})


module.exports = router