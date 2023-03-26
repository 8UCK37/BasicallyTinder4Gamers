const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

//this is to get all the comment under one post
router.get("/", async (req,res)=>{
    let comments = await prisma.Posts.findMany({
        where:
        {
            id : 2
        },
        include: {
            comments: true,
          },
    })
    res.send(comments)
})

// this is to create a new edge in comment tree 
// In req.body commentOf can be null or int
router.post("/add",async (req,res)=>{
    try{
       
        console.log(req.body)
        let edge = await prisma.Posts.update({
            where:{
                id : req.body.postId
            },
            data:{
                comments:{
                    create:{
                        author:'user',
                        commentStr: "str",
                        commentOf : req.body.commentOf
                    }
                }
                
                
            }
        })
        res.send(edge)
    }
    catch(e){
        console.log(e)
        res.send(JSON.stringify({status: "someting went wrong"}))
    }
    
})


module.exports = router