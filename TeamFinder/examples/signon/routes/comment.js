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
            id: parseInt(req.query.id),
        },
        include: {
            comments: {
              include: { author: true },
              where: { deleted: false }
            }
          },
          orderBy:{
            id:'asc'
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

router.post("/commentEdit",ensureAuthenticated, async (req, res)=> {
    console.log('commentEditStr',req.body);
    
        let editComment=await prisma.Comment.updateMany({
            where:{
                id: req.body.id
            },
            data: {
                commentStr: req.body.new_comment
            }
        })
        res.sendStatus(200)
        //console.log(e)
       // res.send(JSON.stringify({ status: "someting went wrong while Editing" }))
})
router.post("/commentDelete",ensureAuthenticated, async (req, res)=> {
    console.log('commentDeltStr',req.body);
    
        let delChildComment=await prisma.Comment.updateMany({
            where:{
                commentOf: req.body.id
            },
            data:{
                deleted:true
            }
        })
        //console.log(e)
       // res.send(JSON.stringify({ status: "someting went wrong while Editing" }))
       let delParComment=await prisma.Comment.updateMany({
        where:{
            id: req.body.id
        },
        data:{
            deleted:true
        }
    })
    res.sendStatus(200)
})

router.post("/commentReactionLike",ensureAuthenticated, async (req, res)=> {
    console.log('comment id =',req.body);
    let check = await prisma.CommentReaction.findMany({
        where:{
          commentid :  parseInt(req.body.id),
          authorid : req.user.user_id,
        }
        })
        if(check.length!=0){
            console.log("found",check[0].type)
            let CommentReactionUpdate = await prisma.CommentReaction.updateMany({
              where:{
                commentid :  parseInt(req.body.id),
                authorid : req.user.user_id,
              },
              data:{
                type:req.body.type
              }
              })
          }else{
          console.log('not found')
          let commentreaction = await prisma.CommentReaction.create({
            data :{
                commentid :  parseInt(req.body.id),
                type : req.body.type,
                author:{
                    connect:{id:req.user.user_id}
                    },
                }
            })
          }
    res.sendStatus(200)
})
router.post("/commentReactionDisLike",ensureAuthenticated, async (req, res)=> {
    console.log('comment id =',req.body);
    let check = await prisma.CommentReaction.findMany({
        where:{
          commentid :  parseInt(req.body.id),
          authorid : req.user.user_id,
        }
        })
        if(check.length!=0){
            console.log("found",check[0].type)
            let CommentReactionUpdate = await prisma.CommentReaction.updateMany({
              where:{
                commentid :  parseInt(req.body.id),
                authorid : req.user.user_id,
              },
              data:{
                type:'dislike'
              }
              })
          }
    res.sendStatus(200)
})
module.exports = router